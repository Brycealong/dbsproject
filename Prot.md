# Prot

[TOC]

```bash
conda activate django
django-admin startproject Prot
```

## template

```bash
mkdir Prot/templates

# settings.py
import os
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
```

## model

```bash
 sudo service mysql start
 sudo mysql
```

```mysql
create database hello default charset=utf8;
use hello;
```

```python
# settings.py
DATABASES = { 
    'default': 
    { 
        'ENGINE': 'django.db.backends.mysql',    # 数据库引擎
        'NAME': 'hello', # 数据库名称
        'HOST': '127.0.0.1', # 数据库地址，本机 ip 地址 127.0.0.1 
        'PORT': 3306, # 端口 
        'USER': 'root',  # 数据库用户名
        # 'PASSWORD': '123456', # 数据库密码
    }  
}

# __init__.py
import pymysql

pymysql.install_as_MySQLdb()
```

## app

- 使用模型前，必须定义app

```bash
django-admin startapp TestModel
```

```python
# settings.py
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'TestModel',               # 添加此项
)
```

- 修改完model后报错

```bash
django.db.utils.OperationalError: (1449, "The user specified as a definer ('mysql.infoschema'@'localhost') does not exist")
```

```mysql
drop user  'mysql.infoschem'`@"localhost";
flush privileges;
create user 'mysql.infoschema'@"localhost" identified by '123456';
flush privileges;
use mysql;
update user set Select_priv = 'Y' where User = 'mysql.infoschema';
flush privileges;
```

## db 操作

```python
# HelloWorld/Helloworld testdb.py
# -*- coding: utf-8 -*-
 
from django.http import HttpResponse
 
from TestModel.models import Test
 
# 数据库操作
def testdb(request):
    test1 = Test(name='Bigbob')
    test1.save()
    return HttpResponse("<p>数据添加成功！</p>")

# urls.py
urlpatterns += [
    path('testdb/',testdb.testdb)
]
```

## 实战

- MySQL启动

```shell
sudo service mysql start
```

- mysql改密码

```shell
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
flush privileges;
```

- 创建数据库

```mysql
create database Interaction;
```

- 创建APP

```shell
python manage.py startapp Interaction
```

- 在models里创建表
- 导入数据

```shell
mysql -u root -p --local-infile
```

```mysql
load data local infile '/mnt/a/organism_new.txt' into table Interaction_Organism fields terminated by '\t';
```
