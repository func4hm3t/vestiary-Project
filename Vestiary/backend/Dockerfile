FROM python:3.11-slim

# 1) Temel araçlar
RUN apt-get update \
 && apt-get install -y \
      curl \
      gnupg \
      apt-transport-https \
      unixodbc-dev \
      build-essential \
 && rm -rf /var/lib/apt/lists/*

# 2) Microsoft’un apt key ve repo’sunu ekle
RUN curl https://packages.microsoft.com/keys/microsoft.asc \
      | apt-key add - \
 && curl https://packages.microsoft.com/config/debian/11/prod.list \
      > /etc/apt/sources.list.d/mssql-release.list

# 3) ODBC sürücüsünü force-overwrite ile yükle
RUN apt-get update \
 && ACCEPT_EULA=Y apt-get install -y \
      -o Dpkg::Options::="--force-overwrite" \
      msodbcsql17 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /code

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
