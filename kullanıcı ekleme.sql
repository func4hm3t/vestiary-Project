USE Vestiary;
GO

INSERT INTO Users (
  Id,
  Username,
  PasswordHash,
  Email,
  Role,
  CreatedAt,
  UpdatedAt
)
VALUES (
  NEWID(),
  'deneme',
  '$2b$10$FWm7cSE5ioGvFHOcYhcakuq/UN2.haTMjhFsTngQwBtraK4XhrJWK',
  'deneme@ornek.com',
  'user',
  GETDATE(),
  GETDATE()
);
GO
USE Vestiary;
GO

DELETE FROM Users
WHERE Email = 'deneme@ornek.com';
GO
