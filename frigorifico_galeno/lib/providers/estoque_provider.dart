import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../models/produto.dart';
import '../utils/constants.dart';

class EstoqueProvider with ChangeNotifier {
  List<Produto> _estoque = [];
  bool _isLoading = false;

  List<Produto> get estoque => _estoque;
  bool get isLoading => _isLoading;

  Future<void> fetchEstoque() async {
    _isLoading = true;
    notifyListeners();

    final response = await http.get(Uri.parse('$API_URL/estoque'));

    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      _estoque = data.map((item) => Produto.fromJson(item)).toList();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> adicionarEstoque(String nomeProduto, double quantidade) async {
    final response = await http.post(
      Uri.parse('$API_URL/estoque/entrada'),
      body: json.encode({'produto': nomeProduto, 'quantidade': quantidade}),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      fetchEstoque();
    }
  }

  Future<void> removerEstoque(int idProduto, double quantidade) async {
    final response = await http.post(
      Uri.parse('$API_URL/estoque/saida'),
      body: json.encode({'id': idProduto, 'quantidade': quantidade}),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      fetchEstoque();
    }
  }
}
