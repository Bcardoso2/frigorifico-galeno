import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/estoque_screen.dart';
import 'screens/producao_screen.dart';
import 'screens/vendas_screen.dart';
import 'screens/relatorios_screen.dart';
import 'providers/auth_provider.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => LoginScreen(),
        '/home': (context) => HomeScreen(),
        '/estoque': (context) => EstoqueScreen(),
        '/producao': (context) => ProducaoScreen(),
        '/vendas': (context) => VendasScreen(),
        '/relatorios': (context) => RelatoriosScreen(),
      },
    );
  }
}
