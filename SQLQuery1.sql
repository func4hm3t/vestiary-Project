-- 1) Yeni bir veritabaný oluþtur
CREATE DATABASE Vestiary;
GO

-- 2) Oluþturduðumuz veritabanýný kullan
USE Vestiary;
GO

-- 3) Users tablosu (admin/editor rolleriyle)
CREATE TABLE dbo.Users (
  Id            UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID() PRIMARY KEY,
  Username      NVARCHAR(50)     NOT NULL UNIQUE,
  Email         NVARCHAR(100)    NOT NULL UNIQUE,
  PasswordHash  NVARCHAR(256)    NOT NULL,
  Role          NVARCHAR(20)     NOT NULL  /* Örneðin: 'admin' veya 'editor' */,
  CreatedAt     DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedAt     DATETIME2        NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 4) Pages tablosu (dinamik olarak güncellenebilecek sayfalar)
CREATE TABLE dbo.Pages (
  Id        INT            IDENTITY(1,1) PRIMARY KEY,
  Slug      NVARCHAR(100)  NOT NULL UNIQUE,     -- örn. 'about', 'home-banner'
  Title     NVARCHAR(200)  NOT NULL,
  Content   NVARCHAR(MAX)  NOT NULL,
  CreatedAt DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedAt DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 5) Products tablosu (eðer ürün yönetimi de istiyorsanýz)
CREATE TABLE dbo.Products (
  Id          INT            IDENTITY(1,1) PRIMARY KEY,
  Name        NVARCHAR(200)  NOT NULL,
  Description NVARCHAR(MAX)  NULL,
  Price       DECIMAL(10,2)  NOT NULL,
  ImageUrl    NVARCHAR(500)  NULL,
  CreatedAt   DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedAt   DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- 6) Güncelleme trigger’larý (opsiyonel)
-- Her UPDATE’te UpdatedAt kolonunu otomatik güncellemek için:
CREATE TRIGGER dbo.Users_UpdateTimestamp
ON dbo.Users
AFTER UPDATE
AS
  UPDATE dbo.Users
    SET UpdatedAt = SYSUTCDATETIME()
  FROM dbo.Users U
  JOIN inserted i ON U.Id = i.Id;
GO

CREATE TRIGGER dbo.Pages_UpdateTimestamp
ON dbo.Pages
AFTER UPDATE
AS
  UPDATE dbo.Pages
    SET UpdatedAt = SYSUTCDATETIME()
  FROM dbo.Pages P
  JOIN inserted i ON P.Id = i.Id;
GO

CREATE TRIGGER dbo.Products_UpdateTimestamp
ON dbo.Products
AFTER UPDATE
AS
  UPDATE dbo.Products
    SET UpdatedAt = SYSUTCDATETIME()
  FROM dbo.Products P
  JOIN inserted i ON P.Id = i.Id;
GO
