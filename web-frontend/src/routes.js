import React from 'react';

const Breadcrumbs = React.lazy(() => import('./views_temp/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views_temp/Base/Cards'));
const Carousels = React.lazy(() => import('./views_temp/Base/Carousels'));
const Collapses = React.lazy(() => import('./views_temp/Base/Collapses'));
const Dropdowns = React.lazy(() => import('./views_temp/Base/Dropdowns'));
const Forms = React.lazy(() => import('./views_temp/Base/Forms'));
const Jumbotrons = React.lazy(() => import('./views_temp/Base/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views_temp/Base/ListGroups'));
const Navbars = React.lazy(() => import('./views_temp/Base/Navbars'));
const Navs = React.lazy(() => import('./views_temp/Base/Navs'));
const Paginations = React.lazy(() => import('./views_temp/Base/Paginations'));
const Popovers = React.lazy(() => import('./views_temp/Base/Popovers'));
const ProgressBar = React.lazy(() => import('./views_temp/Base/ProgressBar'));
const Switches = React.lazy(() => import('./views_temp/Base/Switches'));
const Tables = React.lazy(() => import('./views_temp/Base/Tables'));
const Tabs = React.lazy(() => import('./views_temp/Base/Tabs'));
const Tooltips = React.lazy(() => import('./views_temp/Base/Tooltips'));
const BrandButtons = React.lazy(() => import('./views_temp/Buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views_temp/Buttons/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views_temp/Buttons/ButtonGroups'));
const Buttons = React.lazy(() => import('./views_temp/Buttons/Buttons'));
const Charts = React.lazy(() => import('./views_temp/Charts'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views_temp/Icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views_temp/Icons/Flags'));
const FontAwesome = React.lazy(() => import('./views_temp/Icons/FontAwesome'));
const SimpleLineIcons = React.lazy(() => import('./views_temp/Icons/SimpleLineIcons'));
const Alerts = React.lazy(() => import('./views_temp/Notifications/Alerts'));
const Badges = React.lazy(() => import('./views_temp/Notifications/Badges'));
const Modals = React.lazy(() => import('./views_temp/Notifications/Modals'));
const Colors = React.lazy(() => import('./views_temp/Theme/Colors'));
const Typography = React.lazy(() => import('./views_temp/Theme/Typography'));
const Widgets = React.lazy(() => import('./views_temp/Widgets/Widgets'));
const Users = React.lazy(() => import('./views_temp/Users/Users'));
const User = React.lazy(() => import('./views_temp/Users/User'));

//MASTER
const indexTiang      = React.lazy(() => import('./views/Tiang'));
const indexPerusahaan = React.lazy(() => import('./views/Perusahaan'));
const indexLokasi     = React.lazy(() => import('./views/Lokasi'));
const indexCabang     = React.lazy(() => import('./views/Cabang'));
const indexCctv       = React.lazy(() => import('./views/Cctv'));
const indexUser       = React.lazy(() => import('./views/User'));
const indexPrivilege  = React.lazy(() => import('./views/Privilege'));
const indexMenu       = React.lazy(() => import('./views/Menu'));
const indexSubMenu    = React.lazy(() => import('./views/Submenu'));
const indexTtd        = React.lazy(() => import('./views/Ttd'));

//MAINTENANCE
const mtRecord    = React.lazy(() => import('./views/Maintenance/index'));
const mtReport    = React.lazy(() => import('./views/Maintenance/report'));

//INCIDENT
const incRecord    = React.lazy(() => import('./views/Incident/index'));
const incReport    = React.lazy(() => import('./views/Incident/report'));

//REPORT
const reportDaily     = React.lazy(() => import('./views/Report/daily'));
const reportRealisasi = React.lazy(() => import('./views/Report/realisasi'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', exact: true, name: 'Theme', component: Colors },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', exact: true, name: 'Base', component: Cards },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/forms', name: 'Forms', component: Forms },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', exact: true, name: 'Buttons', component: Buttons },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },

  //MASTER
  { path: '/master/tiang', exact: true, name: 'Master Tiang', component: indexTiang },
  { path: '/master/perusahaan', exact: true, name: 'Master Perusahaan', component: indexPerusahaan },
  { path: '/master/lokasi', exact: true, name: 'Master Lokasi', component: indexLokasi },
  { path: '/master/cabang', exact: true, name: 'Master Cabang', component: indexCabang },
  { path: '/master/cctv', exact: true, name: 'Master CCTV', component: indexCctv },
  { path: '/master/user', exact: true, name: 'Master User', component: indexUser },
  { path: '/master/privilege', exact: true, name: 'Master Privilege', component: indexPrivilege },
  { path: '/master/menu', exact: true, name: 'Master Menu', component: indexMenu },
  { path: '/master/sub-menu', exact: true, name: 'Master Sub Menu', component: indexSubMenu },
  { path: '/master/ttd', exact: true, name: 'Master TTD', component: indexTtd },


  { path: '/maintenance/record-data', exact: true, name: 'Record Data Maintenance', component: mtRecord },
  { path: '/maintenance/report', exact: true, name: 'Report Maintenance', component: mtReport },

  { path: '/incident/record-data', exact: true, name: 'Record Data Incident', component: incRecord },
  { path: '/incident/report', exact: true, name: 'Report Incident', component: incReport },

  { path: '/report/daily', exact: true, name: 'Report Daily', component: reportDaily },
  { path: '/report/realisasi', exact: true, name: 'Report Realisasi', component: reportRealisasi },
  
];

export default routes;
