# 📚 Connect English Finance

Sistema de gestión administrativa para escuelas de inglés. Permite llevar un control completo de alumnos, cursos y transacciones financieras de manera eficiente e intuitiva.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![HeroUI](https://img.shields.io/badge/HeroUI-2.6-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)

## ✨ Características Principales

### 👥 Gestión de Alumnos
- **Registro completo** de información de estudiantes
- **Asignación a cursos/grupos** para organizar a los alumnos
- **Historial de pagos** por alumno para un seguimiento detallado
- **Búsqueda y filtrado** rápido de alumnos

### 📖 Gestión de Cursos
- **Creación y edición** de cursos o grupos
- **Visualización** de alumnos inscritos por curso
- **Administración flexible** de la oferta académica

### 💰 Monitor Financiero
- **Registro de ingresos** (pagos de colegiaturas, inscripciones, etc.)
- **Registro de egresos** (gastos operativos, materiales, etc.)
- **Dashboard visual** con gráficas de ingresos vs egresos
- **Historial de transacciones** con filtros por fecha
- **Exportación a Excel** de reportes financieros

### 🔐 Seguridad
- **Autenticación de usuarios** con Lucia Auth
- **Gestión de contraseñas** segura
- **Control de acceso** a las diferentes secciones

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) con App Router |
| **UI Library** | [HeroUI v2](https://heroui.com/) |
| **Estilos** | [Tailwind CSS](https://tailwindcss.com/) |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) |
| **Animaciones** | [Framer Motion](https://www.framer.com/motion/) |
| **Base de Datos** | SQLite con [LibSQL](https://turso.tech/libsql) |
| **Autenticación** | [Lucia Auth](https://lucia-auth.com/) |
| **Gráficas** | [ApexCharts](https://apexcharts.com/) |
| **Exportación** | [excel4node](https://www.npmjs.com/package/excel4node) |

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── (full-options)/     # Rutas protegidas
│   │   ├── alumnos/        # Gestión de alumnos
│   │   ├── cursos/         # Gestión de cursos
│   │   └── monitor/        # Monitor financiero
│   ├── api/                # API Routes
│   └── login/              # Autenticación
├── components/             # Componentes React
│   ├── Alumnos/            # Componentes de alumnos
│   ├── Cursos/             # Componentes de cursos
│   ├── Monitor/            # Componentes financieros
│   └── ui/                 # Componentes UI reutilizables
├── lib/                    # Utilidades y configuración
└── types/                  # Definiciones de TypeScript
```

## 📝 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta el linter |

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).
