import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../services/api_service.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService apiService = ApiService();
  List<Map<String, dynamic>> cortesMaisEstoque = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _buscarCortesMaisEstoque();
  }

  Future<void> _buscarCortesMaisEstoque() async {
    setState(() => isLoading = true);
    try {
      List<dynamic> response = await apiService.getCortesMaisEstoque(); // 🔹 Busca cortes com mais estoque
      setState(() {
        cortesMaisEstoque = response.map((item) {
          return {
            "nome": item["nome"],
            "quantidade_kg": item["quantidade_kg"].toDouble(),
          };
        }).toList();
      });
    } catch (error) {
      print("❌ Erro ao buscar cortes: $error");
    }
    setState(() => isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Dashboard"),
        backgroundColor: Colors.blueGrey[700],
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // 🔹 Título do gráfico
                  Text(
                    "Cortes com Mais Estoque",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  SizedBox(height: 10),

                  // 🔹 Gráfico de Barras com os cortes disponíveis
                  Container(
                    height: 300,
                    padding: EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.grey[900],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: BarChart(
                      BarChartData(
                        alignment: BarChartAlignment.spaceAround,
                        barGroups: _buildChartSections(),
                        titlesData: FlTitlesData(
                          leftTitles: AxisTitles(
                            sideTitles: SideTitles(showTitles: true, reservedSize: 40),
                          ),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              getTitlesWidget: (double value, TitleMeta meta) {
                                return Text(
                                  cortesMaisEstoque[value.toInt()]["nome"],
                                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                                );
                              },
                            ),
                          ),
                        ),
                        borderData: FlBorderData(show: false),
                        gridData: FlGridData(show: true),
                      ),
                    ),
                  ),

                  SizedBox(height: 20),

                  // 🔹 Seção de Acessos Rápidos
                  Text(
                    "Acessos Rápidos",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  SizedBox(height: 10),

                  GridView.count(
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    children: [
                      _buildDashboardCard(
                        context,
                        title: "Estoque",
                        icon: Icons.inventory,
                        color: Colors.blue,
                        route: "/estoque",
                      ),
                      _buildDashboardCard(
                        context,
                        title: "Produção",
                        icon: Icons.factory,
                        color: Colors.orange,
                        route: "/producao",
                      ),
                      _buildDashboardCard(
                        context,
                        title: "Vendas",
                        icon: Icons.shopping_cart,
                        color: Colors.green,
                        route: "/vendas",
                      ),
                      _buildDashboardCard(
                        context,
                        title: "Relatórios",
                        icon: Icons.bar_chart,
                        color: Colors.purple,
                        route: "/relatorios",
                      ),
                    ],
                  ),
                ],
              ),
            ),
    );
  }

  // 🔹 Gera os dados do gráfico com base nos cortes disponíveis
  List<BarChartGroupData> _buildChartSections() {
    if (cortesMaisEstoque.isEmpty) return [];

    final List<Color> colors = [Colors.blue, Colors.orange, Colors.green, Colors.red, Colors.purple, Colors.yellow];

    return List.generate(cortesMaisEstoque.length, (index) {
      return BarChartGroupData(
        x: index,
        barRods: [
          BarChartRodData(
            toY: cortesMaisEstoque[index]["quantidade_kg"],
            color: colors[index % colors.length], // 🔹 Alterna cores para evitar repetições
            width: 22,
            borderRadius: BorderRadius.circular(6),
          ),
        ],
      );
    });
  }

  // 🔹 Botões de navegação funcionais
  Widget _buildDashboardCard(BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required String route,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, route);
      },
      child: Card(
        color: Colors.grey[850],
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 50, color: color),
            SizedBox(height: 10),
            Text(
              title,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
            ),
          ],
        ),
      ),
    );
  }
}
