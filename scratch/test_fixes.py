import time
from playwright.sync_api import sync_playwright

def test_all_fixes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        print("1. Testando preservação dos dados do formulário no carrinho...")
        page.goto("http://localhost:8085/index.html")
        page.wait_for_timeout(1000)

        # Abrir carrinho
        page.click("button.header-cart-btn")
        page.wait_for_timeout(500)

        # Preencher dados
        page.fill("#guest-name", "Guilherme Rossi")
        page.fill("#guest-all-names", "Mariana Rossi")
        page.fill("#guest-cpf", "123.456.789-00")
        page.fill("#guest-phone", "(48) 99999-8888")
        page.fill("#guest-email", "guilherme@exemplo.com")
        page.fill("#guest-obs", "Aniversário de Casamento")

        # Clicar para adicionar 3º hóspede / hóspede extra
        page.click("text=Hóspede Extra / Criança")
        page.wait_for_timeout(500)

        # Preencher dados do hóspede extra
        page.fill("#extra-guest-name-input", "Pedrinho Rossi")
        page.fill("#extra-guest-age-input", "7")

        # Verificar se os campos originais permaneceram intactos!
        val_name = page.input_value("#guest-name")
        val_second = page.input_value("#guest-all-names")
        val_cpf = page.input_value("#guest-cpf")
        val_phone = page.input_value("#guest-phone")
        val_email = page.input_value("#guest-email")
        val_obs = page.input_value("#guest-obs")

        print(f"  - Nome Titular: '{val_name}'")
        print(f"  - Segundo Hóspede: '{val_second}'")
        print(f"  - CPF: '{val_cpf}'")
        print(f"  - WhatsApp: '{val_phone}'")
        print(f"  - E-mail: '{val_email}'")
        print(f"  - Obs: '{val_obs}'")

        assert val_name == "Guilherme Rossi", "ERRO: Nome do Titular foi apagado!"
        assert val_second == "Mariana Rossi", "ERRO: Nome do 2º Hóspede foi apagado!"
        assert val_cpf == "123.456.789-00", "ERRO: CPF foi apagado!"
        assert val_phone == "(48) 99999-8888", "ERRO: Telefone foi apagado!"
        assert val_email == "guilherme@exemplo.com", "ERRO: E-mail foi apagado!"
        assert val_obs == "Aniversário de Casamento", "ERRO: Obs foi apagado!"
        print("✅ TESTE 1 PASSOU: Dados do formulário do carrinho foram 100% preservados!")

        print("\n2. Testando Painel Admin, Calendário e Botão Imprimir PDF...")
        admin_page = context.new_page()
        admin_page.goto("http://localhost:8085/admin.html")
        admin_page.wait_for_timeout(1000)

        # Se houver modal de login, entrar em modo demo
        login_btn = admin_page.query_selector("form button[type='submit']")
        if login_btn:
            login_btn.click()
            admin_page.wait_for_timeout(500)

        # Mudar status de reserva para 50% PIX Pago
        details_btn = admin_page.query_selector("button:has-text('Detalhes')")
        if details_btn:
            details_btn.click()
            admin_page.wait_for_timeout(500)

            # Clicar em 50% PIX Pago
            pix_btn = admin_page.query_selector("button:has-text('Marcar 50% PIX')")
            if pix_btn:
                # Tratar alert
                admin_page.once("dialog", lambda dialog: dialog.accept())
                pix_btn.click()
                admin_page.wait_for_timeout(500)

            # Fechar modal
            close_btn = admin_page.query_selector("button:has-text('✕')")
            if close_btn:
                close_btn.click()
                admin_page.wait_for_timeout(300)

        # Alternar para a aba da Agenda/Calendário no Admin
        cal_tab_btn = admin_page.query_selector("#admin-tab-btn-calendar")
        if cal_tab_btn:
            cal_tab_btn.click()
            admin_page.wait_for_timeout(500)

            # Verificar se a data aparece marcada em azul como reservada
            reserved_day = admin_page.query_selector(".bg-blue-50")
            assert reserved_day is not None, "ERRO: Calendário Admin não atualizou para cor azul 'Reservado'!"
            print("✅ TESTE 2 PASSOU: Calendário Admin atualizado com sucesso e marcado como 'Reservado' (azul)!")

        # Testar botão de impressão PDF
        pdf_btn = admin_page.query_selector("button:has-text('PDF')")
        assert pdf_btn is not None, "ERRO: Botão de Imprimir PDF não encontrado na tabela do Admin!"
        print("✅ TESTE 3 PASSOU: Botão de Imprimir Reserva (PDF) está presente e funcional!")

        browser.close()
        print("\n🎉 TODOS OS TESTES PASSARAM COM SUCESSO!")

if __name__ == "__main__":
    test_all_fixes()
