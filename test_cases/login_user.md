# Должен выполнять вход пользователя в систему:

## До
1. Открыть https://demo.realworld.io/

## Открыть форму входа в систему

2. Нажмите на ссылку **Sign In** в заголовке приложения
3. Url должен быть `/#/login`
4. Заголовок страницы должен быть **Sign In**

## Заполните форму входа в систему

5. Страница должна содержать форму
6. Введите `{email}` в поле формы **Email**
7. Введите `{password}` в поле формы **password**

## Отправить форму

8. Нажмите на кнопку **Sign In**

## Проверить, что пользователь вошел в систему

9. Заголовок должен содержать `{user_name}`

## Где:
* `{email}`
    * действительный e-mail
    * был зарегистрирован ранее
* `{password}` - пароль текущего пользователя
* `{user_name}` - имя зарегистрированного пользователя для `{email}`