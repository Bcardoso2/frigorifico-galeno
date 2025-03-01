import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/auth_provider.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class VendasScreen extends StatefulWidget {
  @override
  _VendasScreenState createState() => _VendasScreenState();
}

class _VendasScreenState extends State<VendasScreen> {
  final ApiService apiService = ApiService();
  List<dynamic> cortesDisponiveis = [];
  bool isLoading = false;
  int? usuarioId;

  @override
  void initState() {
    super.initState();
    usuarioId = Provider.of<AuthProvider>(context, listen: false).userId;
    _buscarCortesDisponiveis();
  }

  Future<void> _buscarCortesDisponiveis() async {
    setState(() => isLoading = true);
    try {
      final response = await http.get(Uri.parse("http://localhost:3002/api/estoque/cortes_disponiveis"));

      if (response.statusCode == 200) {
        setState(() {
          cortesDisponiveis = jsonDecode(response.body);
        });
      } else {
        _mostrarMensagem("Erro ao buscar cortes disponíveis.");
      }
    } catch (error) {
      print("❌ Erro ao buscar cortes: $error");
      _mostrarMensagem("Erro ao buscar cortes disponíveis.");
    }
    setState(() => isLoading = false);
  }

  Future<void> _registrarVenda(String produtoId, double quantidade) async {
    setState(() => isLoading = true);
    try {
      await apiService.registrarVenda(produtoId, quantidade, usuarioId!);
      _mostrarMensagem("Venda registrada com sucesso!");
      _buscarCortesDisponiveis(); // Atualiza a lista de cortes
    } catch (error) {
      print("❌ Erro ao registrar venda: $error");
      _mostrarMensagem("Erro ao registrar venda.");
    }
    setState(() => isLoading = false);
  }

  void _mostrarMensagem(String mensagem) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(mensagem)));
  }

  void _abrirDialogoVenda(BuildContext context, Map<String, dynamic> corte) {
    TextEditingController quantidadeController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text("Registrar Venda"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text("Corte: ${corte["nome"]}"),
              SizedBox(height: 10),
              TextField(
                controller: quantidadeController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(labelText: "Quantidade Vendida (KG)"),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: Text("Cancelar")),
            ElevatedButton(
              onPressed: () {
                double quantidadeVendida = double.tryParse(quantidadeController.text) ?? 0.0;

                if (quantidadeVendida > 0 && corte["quantidade_kg"] >= quantidadeVendida) {
                  _registrarVenda(corte["id"].toString(), quantidadeVendida);
                  Navigator.pop(context);
                } else {
                  _mostrarMensagem("Quantidade inválida ou estoque insuficiente!");
                }
              },
              child: Text("Confirmar"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(title: Text("Vendas"), backgroundColor: Colors.green),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              "Cortes Disponíveis para Venda",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            SizedBox(height: 10),
            if (isLoading) Center(child: CircularProgressIndicator()),

            // 🔹 Lista de Produtos Disponíveis para Venda
            if (!isLoading && cortesDisponiveis.isNotEmpty)
              Expanded(
                child: ListView.builder(
                  itemCount: cortesDisponiveis.length,
                  itemBuilder: (context, index) {
                    var corte = cortesDisponiveis[index];
                    return Card(
                      color: Colors.grey[850],
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      child: ListTile(
                        title: Text(
                          corte["nome"],
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        subtitle: Text(
                          "Estoque: ${corte["quantidade_kg"].toStringAsFixed(2)} KG",
                          style: TextStyle(fontSize: 16, color: Colors.white60),
                        ),
                        trailing: Icon(Icons.add_shopping_cart, color: Colors.green),
                        onTap: () => _abrirDialogoVenda(context, corte),
                      ),
                    );
                  },
                ),
              ),

            if (!isLoading && cortesDisponiveis.isEmpty)
              Center(
                child: Text("Nenhum corte disponível para venda.", style: TextStyle(color: Colors.white)),
              ),
          ],
        ),
      ),
    );
  }
}
