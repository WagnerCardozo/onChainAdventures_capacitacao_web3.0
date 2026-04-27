README
▶️ Execução do Projeto.
O projeto On Chain Adventures é composto por smart contracts já deployados na rede de teste Sepolia e uma interface web simples que permite interagir com esses contratos.
Para executar o projeto localmente, não é necessário backend ou instalação de dependências complexas.
1. Pré-requisitos.
Navegador com a extensão MetaMask instalada.
MetaMask configurado na rede Sepolia.
ETH de teste na carteira (para pagar taxas de transação).

2. Executando o Front-End.
Baixe ou clone o projeto.
Abra o arquivo index.html diretamente no navegador
 ou utilize um servidor local simples (recomendado), como:
python -m http.server
ou
npx serve
Acesse no navegador:
http://localhost:8000  (sugiro usar google chrome).

3. Como Usar
Após abrir o projeto:
Clique em Conectar Carteira.
Autorize a conexão com o MetaMask.
Certifique-se de que está na rede Sepolia.

4. Fluxo Esperado
👤 Criar personagem.
Insira um nome.
Clique em “Criar Personagem”.
Um NFT será criado para sua carteira.

💸 Receber tokens
Clique em “Receber Tokens”.
Tokens serão enviados para sua carteira (com cooldown).

🛒 Comprar itens
Escolha um item (espada ou poção)
O sistema irá:
Aprovar o gasto de tokens.
Executar a compra.
Adicionar o item ao inventário.

🌿 Expedição (Staking)
Clique em “Enviar”.
Tokens serão enviados para o contrato de staking.

💰 Coletar recompensa
Clique em “Retornar”
Você receberá:
Tokens acumulados.
Possivelmente um item (chance aleatória).

🎒 Inventário
Clique em “Ver Inventário”.
Exibe a quantidade de itens possuídos.

🗳️ Propostas (DAO)
Crie uma proposta.
Apoie propostas existentes.

5. Observações Importantes
Todas as ações envolvem transações na blockchain.
Pode haver pequenos delays devido à confirmação da rede.
Os valores exibidos podem conter casas decimais longas devido ao padrão ERC20 (18 casas).

6. Resultado Esperado
Ao final da execução, o usuário deve ser capaz de:
Criar um personagem NFT,
Receber e utilizar tokens,
Comprar itens,
Participar do sistema de staking,
Receber recompensas,
Visualizar inventário,
Criar e apoiar propostas.

7. Considerações
O projeto foi desenvolvido com foco educacional e demonstra a integração entre múltiplos contratos inteligentes. Algumas simplificações foram feitas intencionalmente, especialmente em governança e aleatoriedade, para priorizar clareza e funcionamento do sistema como um todo.
