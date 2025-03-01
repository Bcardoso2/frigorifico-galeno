import 'package:flutter/material.dart';

class RelatoriosScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Relatórios"),
        backgroundColor: Colors.purple,
      ),
      body: Center(child: Text("Tela de relatórios e estatísticas")),
    );
  }
}
