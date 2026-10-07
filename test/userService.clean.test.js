const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Limpos', () => {
    let userService;

    beforeEach(() => {
        userService = new UserService();
        userService._clearDB();
    });

    // Dividimos o Eager Test original em dois testes focados e menores
    test('deve criar um usuário corretamente', () => {
        // Arrange
        const nome = 'Fulano';
        const email = 'fulano@teste.com';
        const idade = 25;

        // Act
        const usuarioCriado = userService.createUser(nome, email, idade);

        // Assert
        expect(usuarioCriado.id).toBeDefined();
        expect(usuarioCriado.nome).toBe(nome);
        expect(usuarioCriado.status).toBe('ativo');
    });

    test('deve buscar um usuário pelo ID', () => {
        // Arrange
        const usuarioCriado = userService.createUser('Fulano', 'fulano@teste.com', 25);

        // Act
        const usuarioBuscado = userService.getUserById(usuarioCriado.id);

        // Assert
        expect(usuarioBuscado.id).toBe(usuarioCriado.id);
        expect(usuarioBuscado.nome).toBe('Fulano');
    });

    // Removemos o for e o if/else. Transformamos em dois testes diretos.
    test('deve desativar um usuário comum', () => {
        // Arrange
        const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

        // Act
        const resultado = userService.deactivateUser(usuarioComum.id);
        const usuarioAtualizado = userService.getUserById(usuarioComum.id);

        // Assert
        expect(resultado).toBe(true);
        expect(usuarioAtualizado.status).toBe('inativo');
    });

    test('não deve desativar um administrador', () => {
        // Arrange
        const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

        // Act
        const resultado = userService.deactivateUser(usuarioAdmin.id);
        const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

        // Assert
        expect(resultado).toBe(false);
        expect(usuarioAtualizado.status).toBe('ativo');
    });

    // Deixamos o teste menos frágil: em vez de amarrar a uma string exata e quebrar com um espaço a mais, focamos no conteúdo relevante.
    test('deve gerar um relatório contendo os usuários cadastrados', () => {
        // Arrange
        userService.createUser('Alice', 'alice@email.com', 28);
        userService.createUser('Bob', 'bob@email.com', 32);

        // Act
        const relatorio = userService.generateUserReport();

        // Assert
        expect(relatorio).toContain('--- Relatório de Usuários ---');
        expect(relatorio).toContain('Alice');
        expect(relatorio).toContain('Bob');
        expect(relatorio).toContain('ativo');
    });

    // Resolvemos o problema do falso positivo usando o toThrow nativo do Jest.
    test('deve lançar erro ao tentar criar usuário menor de idade', () => {
        // Arrange
        const nome = 'Menor';
        const email = 'menor@email.com';
        const idade = 17;

        // Act & Assert
        expect(() => {
            userService.createUser(nome, email, idade);
        }).toThrow('O usuário deve ser maior de idade.');
    });

    // Implementamos o teste que estava abandonado com skip.
    test('deve retornar uma mensagem de lista vazia quando não há usuários', () => {
        // Arrange (O beforeEach já limpa o DB)

        // Act
        const relatorio = userService.generateUserReport();

        // Assert
        expect(relatorio).toContain('Nenhum usuário cadastrado.');
    });
});