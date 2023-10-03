# Должен выполнять регистрацию пользователя:

## До

1. Открыть https://demo.realworld.io/

## Открыть форму регистрации

2. Нажмите на ссылку **Sign Up** в шапке приложения
3. Урл должен быть `/#/register`.
4. Заголовок страницы должен быть **Sign Up**

## Заполните форму регистрации

5. Страница должна содержать форму
6. Введите `{user_name}` в поле формы **Имя пользователя**
7. Введите `{email}` в поле формы **Email**
8. Введите `{password}` в поле формы **Пароль**

## Отправить форму

9. Нажмите на кнопку **Зарегистрироваться**

## Проверить, что пользователь вошел в систему

10. Заголовок должен содержать `{user_name}`

# Где:

* `{user_name}`
    * строка с шаблоном `[0-9a-zA-Z_]{5, 10}`
    * не была зарегистрирована ранее
* `{email}`
    * действительный e-mail
    * ранее не регистрировался
* `{password}` - строка с шаблоном `[0-9a-zA-Z_]{6, 16}`