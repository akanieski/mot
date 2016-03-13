
/****** Object:  Table [dbo].[ThroneCategories]    Script Date: 3/13/2016 11:01:06 AM ******/
CREATE TABLE [dbo].[ThroneCategories](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](255) NOT NULL,
 CONSTRAINT [PK__ThroneCategories] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)



/****** Object:  Table [dbo].[Thrones]    Script Date: 3/13/2016 11:01:07 AM ******/
CREATE TABLE [dbo].[Thrones](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](255) NOT NULL,
	[Latitude] [float] NOT NULL,
	[Longitude] [float] NOT NULL,
	[GeographyPoint]  AS ([geography]::STGeomFromText(((('POINT('+CONVERT([varchar](20),[Longitude]))+' ')+CONVERT([varchar](20),[Latitude]))+')',(4326))),
	[CategoryId] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

/****** Object:  Table [dbo].[Users]    Script Date: 3/13/2016 11:01:09 AM ******/
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [varchar](50) NOT NULL,
	[Password] [varchar](250) NOT NULL,
	[IsAdmin] [bit] NOT NULL,
	[Email] [varchar](250) NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_IsAdmin]  DEFAULT ((0)) FOR [IsAdmin]
