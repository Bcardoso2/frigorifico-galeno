class Produto {
  final int id;
  final String nome;
  final double quantidadeKg;

  Produto({required this.id, required this.nome, required this.quantidadeKg});

  factory Produto.fromJson(Map<String, dynamic> json) {
    return Produto(
      id: json['id'],
      nome: json['nome'],
      quantidadeKg: json['quantidade_kg'].toDouble(),
    );
  }
}
