import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class ProducaoScreen extends StatefulWidget {
  @override
  _ProducaoScreenState createState() => _ProducaoScreenState();
}

class _ProducaoScreenState extends State<ProducaoScreen> {
  final ApiService apiService = ApiService();
  List<dynamic> cortes = [];
  int? parteSelecionadaId;
  bool isLoading = false;
  bool producaoIniciada = false;
  Map<int, double> producao = {}; 
  int? usuarioId;

  final Map<int, String> partes = {
    1: "TRASEIRO",
    2: "DIANTEIRO",
    3: "P.A"
  };

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      setState(() {
        usuarioId = authProvider.userId;
      });
      if (usuarioId == null) {
        _mostrarMensagem("Erro: Usuário não autenticado.");
      }
    });
  }

  Future<void> _iniciarProducao() async {
    if (parteSelecionadaId == null) {
      _mostrarMensagem("Erro: Selecione uma parte antes de iniciar a produção.");
      return;
    }

    if (usuarioId == null) {
      _mostrarMensagem("Erro: Usuário não autenticado. Faça login novamente.");
      return;
    }

    setState(() => isLoading = true);

    try {
      await apiService.iniciarProducao(parteSelecionadaId!, usuarioId!);
      setState(() {
        producaoIniciada = true;
      });
      _mostrarMensagem("Produção iniciada com sucesso!");
      _buscarCortes();
    } catch (error) {
      print("❌ Erro ao iniciar produção: $error");
      _mostrarMensagem("Erro ao iniciar produção");
    }

    setState(() => isLoading = false);
  }

  Future<void> _buscarCortes() async {
    if (parteSelecionadaId == null) return;

    setState(() => isLoading = true);
    try {
      final responseCortes = await http.get(
        Uri.parse("http://localhost:3002/api/cortes/parte/$parteSelecionadaId"),
      );

      print("📢 Resposta da API Cortes: ${responseCortes.body}");

      if (responseCortes.statusCode == 200) {
        setState(() {
          cortes = jsonDecode(responseCortes.body) ?? [];
          producao.clear();
        });
      } else {
        _mostrarMensagem("Erro ao buscar cortes");
      }
    } catch (error) {
      print("❌ Erro ao buscar cortes: $error");
      _mostrarMensagem("Erro ao buscar cortes");
    }
    setState(() => isLoading = false);
  }

  Future<void> _finalizarProducao() async {
    if (parteSelecionadaId == null || producao.isEmpty) {
      _mostrarMensagem("Erro: Selecione uma parte e preencha os cortes.");
      return;
    }

    if (usuarioId == null) {
      _mostrarMensagem("Erro: Usuário não autenticado.");
      return;
    }

    double totalProduzido = producao.values.fold(0.0, (a, b) => a + b);

    setState(() => isLoading = true);
    try {
      // 🔹 Enviando os dados no formato correto
      Map<String, dynamic> requestBody = {
        "parte_id": parteSelecionadaId,
        "cortes": producao.map((key, value) => MapEntry(key.toString(), value)),
        "usuario_id": usuarioId,
      };

      print("📢 Enviando dados para API: $requestBody");

      bool sucesso = await apiService.finalizarProducao(requestBody);

      if (sucesso) {
        _mostrarMensagem("Produção finalizada!");

        setState(() {
          producaoIniciada = false;
          parteSelecionadaId = null;
          cortes = [];
          producao.clear();
        });
      } else {
        _mostrarMensagem("Erro ao finalizar produção!");
      }
    } catch (error) {
      print("❌ Erro ao finalizar produção: $error");
      _mostrarMensagem("Erro ao finalizar produção");
    }

    setState(() => isLoading = false);
  }

  void _mostrarMensagem(String mensagem) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(mensagem)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(title: Text("Produção"), backgroundColor: Colors.orange),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            DropdownButtonFormField<int>(
              value: parteSelecionadaId,
              items: partes.keys.map<DropdownMenuItem<int>>((int key) {
                return DropdownMenuItem<int>(
                  value: key,
                  child: Text(partes[key]!, style: TextStyle(color: Colors.white)),
                );
              }).toList(),
              onChanged: (value) {
                if (!producaoIniciada) {
                  setState(() {
                    parteSelecionadaId = value;
                  });
                }
              },
              decoration: InputDecoration(
                labelText: "Selecione a Parte",
                labelStyle: TextStyle(color: Colors.white),
                filled: true,
                fillColor: Colors.grey[800],
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
              dropdownColor: Colors.grey[850],
            ),

            SizedBox(height: 10),

            if (!producaoIniciada)
              ElevatedButton(
                onPressed: _iniciarProducao,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  padding: EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                ),
                child: Text("Iniciar Produção", style: TextStyle(fontSize: 18, color: Colors.white)),
              ),

            if (isLoading) Center(child: CircularProgressIndicator()),

            if (producaoIniciada && cortes.isNotEmpty)
              Expanded(
                child: ListView.builder(
                  itemCount: cortes.length,
                  itemBuilder: (context, index) {
                    var corte = cortes[index];
                    return Card(
                      color: Colors.grey[850],
                      margin: EdgeInsets.symmetric(vertical: 8.0),
                      child: ListTile(
                        title: Text(
                          corte["nome"],
                          style: TextStyle(fontSize: 18, color: Colors.white),
                        ),
                        subtitle: TextFormField(
                          keyboardType: TextInputType.number,
                          style: TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            labelText: "Peso (kg)",
                            labelStyle: TextStyle(color: Colors.white60),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                          ),
                          onChanged: (value) {
                            setState(() {
                              producao[corte["id"]] = double.tryParse(value) ?? 0.0;
                            });
                          },
                        ),
                      ),
                    );
                  },
                ),
              ),

            SizedBox(height: 20),

            if (producaoIniciada && cortes.isNotEmpty)
              ElevatedButton(
                onPressed: _finalizarProducao,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  padding: EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                ),
                child: Text("Finalizar Produção", style: TextStyle(fontSize: 18, color: Colors.white)),
              ),
          ],
        ),
      ),
    );
  }
}
