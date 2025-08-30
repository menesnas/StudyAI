// import React from 'react';
// import { Link } from 'react-router-dom';
// import { TaskIcon, MapIcon, AIIcon, BellIcon } from './Icons';

// const QuickActions = () => {
//   const actions = [
//     {
//       to: '/tasks',
//       icon: TaskIcon,
//       iconColor: 'text-green-400',
//       iconSize: 'w-5 h-5',
//       title: 'Görevlerim',
//       description: 'Yapılacakları görüntüle'
//     },
//     {
//       to: '/map',
//       icon: MapIcon,
//       iconColor: 'text-red-400',
//       iconSize: 'w-5 h-5',
//       title: 'Çalışma Alanları',
//       description: 'Yakındaki mekanlar'
//     },
//     {
//       to: '/plans',
//       icon: AIIcon,
//       iconColor: 'text-blue-400',
//       iconSize: 'w-5 h-5',
//       title: 'Planlar',
//       description: 'Yapay zeka desteği'
//     },
//     {
//       to: '/notifications',
//       icon: BellIcon,
//       iconColor: 'text-yellow-400',
//       iconSize: 'w-5 h-5',
//       title: 'Bildirimler',
//       description: 'Güncellemeler'
//     }
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       {actions.map((action) => (
//         <QuickActionCard key={action.to} {...action} />
//       ))}
//     </div>
//   );
// };

// const QuickActionCard = ({ to, icon: Icon, iconColor, iconSize, title, description }) => (
//   <Link
//     to={to}
//     className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors duration-200 group"
//   >
//     <div className="flex items-center space-x-3">
//       <Icon className={`${iconColor} ${iconSize} group-hover:scale-110 transition-transform duration-200`} />
//       <div>
//         <h4 className="text-white font-medium">{title}</h4>
//         <p className="text-gray-400 text-sm">{description}</p>
//       </div>
//     </div>
//   </Link>
// );

// export default QuickActions;
