const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const Estoque = require("../models/Estoque");
const Produto = require("../models/Produto");
const Corte = require("../models/Corte"); // 🔹 Certifique-se de que está importado corretamente
const { adicionarEstoque } = require("../controllers/estoqueController");
// 🔹 Rota para adicionar estoque
router.post("/entrada", adicionarEstoque);


Future<void> _buscarCortesDisponiveis() async {
    setState(() => isLoading = true);
    try {
      final response = await http.get(
        Uri.parse('${apiService.baseUrl}/cortes'),
        headers: {'Content-Type': 'application/json'},
      );
      
      if (response.statusCode == 200) {
        // Obtém os cortes da nova rota
        List<dynamic> cortes = json.decode(response.body);
        
        // Filtramos apenas os cortes com estoque disponível e adicionamos os campos
        // necessários para a tela PDV
        List<dynamic> cortesProcessados = [];
        
        for (var corte in cortes) {
          // Precisamos verificar se o corte tem estoque disponível
          // E adicionar o campo 'quantidade_kg' que a tela espera
          if (corte['id'] != null && corte['nome'] != null && corte['preco_kg'] != null) {
            // Adiciona à lista processada
            cortesProcessados.add({
              'id': corte['id'],
              'nome': corte['nome'],
              'preco_kg': corte['preco_kg'],
              // Se o estoque disponível não vier na resposta, 
              // podemos definir um valor padrão ou obtê-lo de outro endpoint
              'quantidade_kg': corte['quantidade_kg'] ?? corte['peso_disponivel'] ?? 1.0
            });
          }
        }
        
        setState(() {
          cortesDisponiveis = cortesProcessados;
        });
      } else {
        throw Exception('Falha ao buscar cortes: ${response.statusCode}');
      }
    } catch (error) {
      print("❌ Erro ao buscar cortes: $error");
      _mostrarMensagem("Erro ao buscar cortes disponíveis.");
    }
    setState(() => isLoading = false);
  }
  router.get("/produtos", async (req, res) => {
    try {
        const produtos = await Produto.findAll({
            attributes: ["id", "nome", "peso_disponivel"], 
            where: { peso_disponivel: { [Op.gt]: 0 } } // Apenas produtos com estoque
        });

        res.json(produtos);
    } catch (error) {
        console.error("❌ Erro ao buscar produtos:", error);
        res.status(500).json({ message: "Erro ao buscar produtos", error });
    }
});

router.get("/", async (req, res) => {
    try {
      const estoque = await Estoque.findAll({
        include: [
          {
            model: Produto,
            attributes: ["id", "nome"], // 🔹 Busca nome do produto
          },
          {
            model: Corte,
            attributes: ["id", "nome"], // 🔹 Busca nome do corte (se aplicável)
          },
        ],
        where: {
          peso_disponivel: { [Op.gt]: 0 }, // 🔹 Apenas itens com quantidade maior que 0
        },
        order: [["peso_disponivel", "DESC"]], // 🔹 Ordena pelo maior estoque
      });
  
      // 🔹 Formata a resposta
      const response = estoque.map((item) => ({
        id: item.id,
        produto: item.Produto ? item.Produto.nome : "Sem Produto",
        corte: item.Corte ? item.Corte.nome : null,
        quantidade_kg: item.peso_disponivel,
      }));
  
      res.json(response);
    } catch (error) {
      console.error("❌ Erro ao buscar estoque:", error);
      res.status(500).json({ message: "Erro ao buscar estoque", error });
    }
  });
  

module.exports = router;
