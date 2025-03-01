import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  int? _userId;

  int? get userId => _userId;

  Future<bool> login(String email, String senha) async {
    try {
      final response = await _apiService.login(email, senha);

      if (response != null && response.containsKey("token") && response.containsKey("usuario")) {
        _userId = response["usuario"]["id"];
        notifyListeners();
        return true;
      } else {
        print("❌ Erro: Resposta inesperada da API.");
        return false;
      }
    } catch (error) {
      print("❌ Erro ao fazer login: $error");
      return false;
    }
  }

  Future<void> loadUserId() async {
    // Aqui você pode carregar o ID do usuário salvo localmente se necessário
  }
}
