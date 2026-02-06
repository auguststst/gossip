def generate_verification_message(language, code):
    if language == "uk":
        message = f"""
                <html>
                <body>
                    <p>Щоб верифікувати свій акаунт і підтвердити, що Instagram належить вам,
                     вам потрібно <span style="font-weight: bold;">скопіювати та вставити код
                     в біографію(опис) вашого профілю Instagram протягом 24 годин</span>. Якщо ви не вирифікуєте,
                     ваш акаунт буде видалено через 2 дні.</p>
                    
                    <p style="font-weight: bold; font-size: 24px;">{code}</p>
                </body>
                </html>
                """
    elif language == "ru":
        message = f"""
                <html>
                <body>
                    <p>Чтобы верифицировать свой аккаунт и подтвердить, что Instagram принадлежит вам,
                      вам нужно <span style="font-weight: bold;">скопировать и вставить код
                      в биографию вашего профиля Instagram в течение 24 часов</span>. Если вы не верифицируете,
                      ваш аккаунт будет удален через 2 дня.</p>
                    
                    <p style="font-weight: bold; font-size: 24px;">{code}</p>
                </body>
                </html>
                """
    else:
        message = f"""
                <html>
                <body>
                    <p>In order to verify your account and confirm that Instagram is yours, 
                    you have to <span style="font-weight: bold;">copy and paste the code into 
                    your Instagram profile Bio for 24 hours</span>. If you don't verify 
                    your account, it will be deleted in 2 days.</p>
                    
                    <p style="font-weight: bold; font-size: 24px;">{code}</p>
                </body>
                </html>
                """
    return message