# CaféApp - Aplicación Web de Café ☕

Una aplicación web completa desarrollada en Vue.js para la gestión de un café, que incluye sistema de usuarios, catálogo de productos, gestión de pedidos, programa de fidelización y más.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación
- **Login/Registro de usuarios** con validación
- **Rutas protegidas** para usuarios autenticados
- **Credenciales de demo**: 
  - Email: `admin@cafe.com`
  - Contraseña: `123456`

### 📱 Catálogo de Productos
- **Visualización de productos** con imágenes atractivas
- **Filtros por categoría**: Café, Bebidas Frías, Panadería, Comida
- **Búsqueda de productos** en tiempo real
- **Calificaciones y precios** claramente visibles

### 🛒 Sistema de Pedidos
- **Carrito de compras** interactivo
- **Proceso de checkout** completo con formulario
- **Múltiples métodos de pago**: Efectivo, Tarjeta, Transferencia
- **Seguimiento de estado** del pedido en tiempo real
- **Historial de pedidos** del usuario

### 👤 Perfil de Usuario
- **Gestión de información personal**
- **Configuración de cuenta**
- **Historial de actividad**

### ⭐ Sistema de Reseñas
- **Calificación de productos** (1-5 estrellas)
- **Comentarios detallados**
- **Filtros por calificación y producto**
- **Estadísticas de reseñas**

### 🎁 Programa de Fidelización
- **Sistema de puntos** por compras y actividades
- **Niveles de membresía**: Bronce, Plata, Oro, Platino
- **Recompensas canjeables**: Cafés gratis, descuentos, combos
- **Historial de puntos** y transacciones

### 🔔 Notificaciones
- **SweetAlert2** integrado para notificaciones elegantes
- **Confirmaciones de acciones**
- **Alertas de éxito y error**
- **Notificaciones de estado de pedido**

## 🛠️ Tecnologías Utilizadas

- **Vue.js 3** - Framework principal
- **Vue Router 4** - Navegación
- **Pinia** - Gestión de estado
- **SweetAlert2** - Notificaciones
- **CSS3** - Estilos personalizados
- **Font Awesome** - Iconografía

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd cafe-app
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run serve
# o
yarn serve
```

4. **Abrir en el navegador**
```
http://localhost:8080
```

### Scripts disponibles

```bash
# Desarrollo
npm run serve
yarn serve

# Construcción para producción
npm run build
yarn build

# Linting
npm run lint
yarn lint
```

## 🏗️ Estructura del Proyecto

```
cafe-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   └── main.css
│   │   └── images/
│   ├── components/
│   │   ├── Navbar.vue
│   │   └── Footer.vue
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── products.js
│   │   └── loyalty.js
│   ├── views/
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Products.vue
│   │   ├── Cart.vue
│   │   ├── OrderStatus.vue
│   │   ├── Orders.vue
│   │   ├── Profile.vue
│   │   ├── Reviews.vue
│   │   └── Loyalty.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── README.md
```

## 🎨 Características de Diseño

### Responsive Design
- **Diseño adaptativo** para desktop, tablet y móvil
- **Navegación optimizada** para dispositivos táctiles
- **Imágenes responsivas** con carga optimizada

### UI/UX
- **Interfaz moderna** con colores cálidos del café
- **Animaciones suaves** y transiciones
- **Iconografía consistente** con Font Awesome
- **Feedback visual** inmediato para todas las acciones

## 🔧 Funcionalidades Técnicas

### Gestión de Estado
- **Pinia stores** para manejo centralizado del estado
- **Persistencia de datos** en localStorage
- **Reactividad** completa entre componentes

### Routing
- **Rutas protegidas** con guards de navegación
- **Navegación dinámica** basada en estado de autenticación
- **URLs amigables** para SEO

### Validación
- **Validación de formularios** en tiempo real
- **Mensajes de error** descriptivos
- **Sanitización de datos** de entrada

## 📱 Páginas Principales

1. **Inicio** - Landing page con productos destacados
2. **Productos** - Catálogo completo con filtros
3. **Carrito** - Gestión de productos y checkout
4. **Perfil** - Información del usuario
5. **Pedidos** - Historial y seguimiento
6. **Fidelización** - Programa de puntos y recompensas
7. **Reseñas** - Sistema de calificaciones

## 🎯 Casos de Uso

### Usuario Nuevo
1. Registro en la plataforma
2. Exploración del catálogo
3. Primer pedido
4. Acumulación de puntos

### Usuario Frecuente
1. Login rápido
2. Uso de recompensas acumuladas
3. Reorden de productos favoritos
4. Escritura de reseñas

### Administración
1. Gestión de productos
2. Seguimiento de pedidos
3. Análisis de reseñas
4. Gestión del programa de fidelización

## 🚀 Próximas Mejoras

- [ ] **Integración con API real** para productos y pedidos
- [ ] **Sistema de pagos** con Stripe/PayPal
- [ ] **Notificaciones push** para estado de pedidos
- [ ] **Chat en vivo** para soporte al cliente
- [ ] **Programa de referidos** expandido
- [ ] **Analytics** y reportes de ventas
- [ ] **Modo oscuro** para la interfaz
- [ ] **PWA** (Progressive Web App) capabilities

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para demostrar las capacidades de Vue.js en aplicaciones web modernas.

---

**¡Disfruta tu café! ☕**
