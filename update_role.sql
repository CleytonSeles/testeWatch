-- Verificar se a coluna role existe na tabela users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
        RAISE NOTICE 'Coluna role adicionada à tabela users';
    ELSE
        RAISE NOTICE 'Coluna role já existe na tabela users';
    END IF;
END $$;

-- Adicionar um usuário admin para teste (se não existir)
INSERT INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@example.com', '$2a$10$rrI.2mREZZYlqeKCi9SyOOrnLHrKHKMIwn4gEQO1pSGkMIpvuoOBS', 'admin')
ON CONFLICT (email) DO 
UPDATE SET role = 'admin'
WHERE users.email = 'admin@example.com';

-- Atualizar qualquer usuário existente para ter um role definido
UPDATE users SET role = 'user' WHERE role IS NULL;
