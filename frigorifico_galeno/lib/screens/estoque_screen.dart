import 'package:flutter/material.dart';
import '../services/api_service.dart';

class EstoqueScreen extends StatefulWidget {
  @override
  _EstoqueScreenState createState() => _EstoqueScreenState();
}

class _EstoqueScreenState extends State<EstoqueScreen> {
  final ApiService apiService = ApiService();
  List<dynamic> estoque = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _carregarEstoque();
  }

  // 🔹 Buscar dados do estoque
  Future<void> _carregarEstoque() async {
    setState(() => isLoading = true);
    try {
      List<dynamic> dados = await apiService.getEstoque();
      setState(() {
        estoque = dados;
      });
    } catch (error) {
      print("❌ Erro ao carregar estoque: $error");
    }
    setState(() => isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Estoque"),
        backgroundColor: Colors.blueGrey[700],
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _carregarEstoque, // 🔹 Botão para atualizar o estoque
          ),
        ],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : estoque.isEmpty
              ? Center(
                  child: Text(
                    "Nenhum item em estoque.",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                )
              : Padding(
                  padding: EdgeInsets.all(16.0),
                  child: ListView.builder(
                    itemCount: estoque.length,
                    itemBuilder: (context, index) {
                      var item = estoque[index];

                      return Card(
                        color: Colors.grey[850],
                        elevation: 4,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        child: ListTile(
                          leading: Icon(Icons.inventory, color: Colors.blue),
                          title: Text(
                            item["produto"]["nome"] ?? "Produto Desconhecido", // 🔹 Corrigido acesso ao nome do produto
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                          ),
                          subtitle: Text(
                            "Quantidade: ${item["quantidade_kg"]} KG\nMovimentação: ${item["tipo_movimentacao"]}",
                            style: TextStyle(fontSize: 16, color: Colors.white60),
                          ),
                          trailing: Icon(Icons.chevron_right, color: Colors.white70),
                          onTap: () {
                            // 🔹 Caso queira detalhar o item ao clicar
                          },
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}
