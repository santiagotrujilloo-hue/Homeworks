import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import AccountPage from "../pages/AccountPage";
import SecurityPage from "../pages/SecurityPage";
import NotificationsPage from "../pages/NotificationsPage";
import FaqPage from "../pages/FaqPage";
import SupportPage from "../pages/SupportPage";
import NetworkPage from "../pages/NetworkPage";

const menuTree = [
  {
    title: "Inicio",
    link: "/",
    component: HomePage,
    children: [],
  },
  {
    title: "Perfil",
    link: "/perfil",
    component: ProfilePage,
    children: [],
  },
  {
    title: "Configuración",
    link: null,
    component: null,
    children: [
      {
        title: "Cuenta",
        link: "/configuracion/cuenta",
        component: AccountPage,
        children: [],
      },
      {
        title: "Seguridad y privacidad",
        link: "/configuracion/seguridad",
        component: SecurityPage,
        children: [],
      },
      {
        title: "Notificaciones",
        link: "/configuracion/notificaciones",
        component: NotificationsPage,
        children: [],
      },
    ],
  },
  {
    title: "Ayuda",
    link: null,
    component: null,
    children: [
      {
        title: "Preguntas frecuentes",
        link: "/ayuda/preguntas",
        component: FaqPage,
        children: [],
      },
      {
        title: "Enviar solicitud",
        link: "/ayuda/soporte",
        component: SupportPage,
        children: [],
      },
      {
        title: "Estado de la red",
        link: "/ayuda/red",
        component: NetworkPage,
        children: [],
      },
    ],
  },
];

export default menuTree;