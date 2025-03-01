import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = "http://localhost:3002/api"; // Ajuste para o IP correto

  // 🔹 Login do Usuário
  Future<Map<String, dynamic>> login(String email, String senha) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/auth/login"),
        body: jsonEncode({"email": email, "senha": senha}),
        headers: {"Content-Type": "application/json"},
      );

      print("📢 Resposta da API Login: ${response.body}");

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print("❌ Erro ao fazer login: ${response.statusCode} - ${response.body}");
        throw Exception("Erro ao fazer login");
      }
    } catch (error) {
      print("❌ Erro na requisição: $error");
      throw Exception("Erro de conexão com o servidor");
    }
  }

  // 🔹 Buscar Estoque (com produtos associados)
  Future<List<dynamic>> getEstoque() async {
    final response = await http.get(Uri.parse("$baseUrl/estoque"));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception("Erro ao buscar estoque");
    }
  }

  // 🔹 Buscar Produtos
  Future<List<dynamic>> getProdutos() async {
    final response = await http.get(Uri.parse("$baseUrl/produtos"));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception("Erro ao buscar produtos");
    }
  }

  // 🔹 Buscar Cortes de uma Parte
  Future<List<dynamic>> getCortes(int produtoId) async {
    final response = await http.get(Uri.parse("$baseUrl/cortes/parte/$produtoId")); // ✅ Corrigido

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception("Erro ao buscar cortes");
    }
  }

  // 🔹 Buscar o peso total disponível de uma parte no estoque
  Future<double> getPesoParte(int produtoId) async {
    final response = await http.get(Uri.parse("$baseUrl/estoque/peso/$produtoId"));

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return double.parse(data["peso"].toString());
    } else {
      throw Exception("Erro ao buscar peso do produto");
    }
  }

Future<bool> iniciarProducao(int produtoId, int usuarioId) async {
  final response = await http.post(
    Uri.parse("$baseUrl/producao/iniciar"),
    headers: {"Content-Type": "application/json"},
    body: json.encode({
      "produto_id": produtoId,
      "kg_recebido": 100,  // ⚠️ Adjust this based on your requirements
      "usuario_id": usuarioId,
    }),
  );

  print("📢 Resposta da API Iniciar Produção: ${response.body}");

  if (response.statusCode == 200) {
    return true; // ✅ Success
  } else {
    print("❌ Erro ao iniciar produção: ${response.statusCode} - ${response.body}");
    return false; // ❌ Failed
  }
}

  // 🔹 Finalizar Produção (Corrigido)
Future<bool> finalizarProducao(Map<String, dynamic> requestBody) async {
  final response = await http.post(
    Uri.parse("$baseUrl/producao/finalizar"),
    headers: {"Content-Type": "application/json"},
    body: json.encode(requestBody),
  );

  if (response.statusCode == 200) {
    return true; // ✅ Success
  } else {
    print("❌ Erro ao finalizar produção: ${response.statusCode} - ${response.body}");
    return false; // ❌ Failed
  }
}

// 🔹 Buscar cortes disponíveis para venda
Future<List<dynamic>> getCortesDisponiveis() async {
  final response = await http.get(Uri.parse("$baseUrl/estoque/cortes_disponiveis"));

  if (response.statusCode == 200) {
    return json.decode(response.body);
  } else {
    throw Exception("Erro ao buscar cortes disponíveis.");
  }
}

// 🔹 Registrar venda
Future<void> registrarVenda(String produtoId, double quantidade, int usuarioId) async {
  final response = await http.post(
    Uri.parse("$baseUrl/vendas"),
    headers: {"Content-Type": "application/json"},
    body: json.encode({
      "produto_id": produtoId,
      "quantidade_vendida": quantidade,
      "usuario_id": usuarioId,
    }),
  );

  if (response.statusCode != 200) {
    throw Exception("Erro ao registrar venda.");
  }
}
// 🔹 Buscar Cortes com mais estoque para o gráfico da dashboard
  Future<List<dynamic>> getCortesMaisEstoque() async {
    try {
      final response = await http.get(Uri.parse("$baseUrl/estoque/cortes_disponiveis"));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception("Erro ao buscar cortes com mais estoque");
      }
    } catch (error) {
      print("❌ Erro ao buscar cortes mais estoque: $error");
      throw Exception("Erro ao buscar cortes disponíveis");
    }
  }
Future<List<dynamic>> getProdutosEstoque() async {
  final response = await http.get(Uri.parse("http://localhost:3002/api/estoque/produtos"));

  if (response.statusCode == 200) {
    return json.decode(response.body);
  } else {
    throw Exception("Erro ao buscar produtos em estoque");
  }
}

}
