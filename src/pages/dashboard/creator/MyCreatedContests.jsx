// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { contestAPI } from '../../../api/contest';
// import { Link } from 'react-router';
// import Swal from 'sweetalert2';
// import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
// import api from '../../../utils/api';
// import { LuClipboardPen } from 'react-icons/lu';

// const MyCreatedContests = () => {
//   const queryClient = useQueryClient();

//   const { data: contests, isLoading } = useQuery({
//     queryKey: ['myCreatedContests'],
//     queryFn: async () => {
//       const { data } = await api.get('/api/contests/my-contests');
//       return data;
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: contestAPI.deleteContest,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['myCreatedContests']);
//       Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500 });
//     },
//   });

//   const handleDelete = (id) => {
//     Swal.fire({
//       title: 'Delete contest?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#20beff',
//     }).then((result) => {
//       if (result.isConfirmed) deleteMutation.mutate(id);
//     });
//   };

//   const getStatusBadge = (status) => {
//     const badges = { pending: 'badge-warning', confirmed: 'badge-success', rejected: 'badge-error' };
//     return badges[status] || 'badge-ghost';
//   };

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="mb-6 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold mb-1">My Contests</h1>
//           <p className="text-gray-600">Manage your contests</p>
//         </div>
//       </div>

//       {isLoading && <div className="skeleton h-40 w-full"></div>}

//       {!isLoading && contests?.length === 0 && (
//         <div className="text-center py-12">
//           <p className="text-6xl mb-2 flex justify-center items-center"><LuClipboardPen /></p>
//           <h3 className="text-xl font-bold mb-2">No Contests Yet</h3>
//           <Link to="/dashboard/add-contest" className="btn bg-[#20beff] text-white mt-4">
//             Create Contest
//           </Link>
//         </div>
//       )}

//       {contests?.length > 0 && (
//         <div className="overflow-x-auto bg-white rounded-lg shadow">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Contest</th>
//                 <th>Type</th>
//                 <th>Status</th>
//                 <th>Participants</th>
//                 <th>Prize</th>
//                 <th>Deadline</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {contests.map((c) => {
//                 const isPending = c.status === 'pending';
//                 const isExpired = new Date(c.deadline) < new Date();
//                 return (
//                   <tr key={c._id}>
//                     <td>
//                       <div className="flex items-center gap-3">
//                         <img src={c.image} alt="" className="w-12 h-12 rounded" />
//                         <div>
//                           <div className="font-bold">{c.name}</div>
//                           <div className="text-sm text-gray-500">{c.description.slice(0, 30)}...</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>
//                       <span className="badge badge-sm">{c.contestType}</span>
//                     </td>
//                     <td>
//                       <span className={`badge badge-sm ${getStatusBadge(c.status)}`}>{c.status}</span>
//                     </td>
//                     <td className="text-center font-semibold">{c.participantCount}</td>
//                     <td className="font-semibold text-[#20beff]">${c.prizeMoney}</td>
//                     <td>
//                       <div className="text-sm">{new Date(c.deadline).toLocaleDateString()}</div>
//                       {isExpired && <span className="badge badge-error badge-xs">Expired</span>}
//                     </td>
//                     <td>
//                       <div className="flex gap-1">
//                         <Link to={`/dashboard/submissions/${c._id}`} className="btn btn-ghost btn-xs">
//                           <FaEye />
//                         </Link>
//                         {isPending && (
//                           <>
//                             <Link to={`/dashboard/edit-contest/${c._id}`} className="btn btn-ghost btn-xs text-blue-500">
//                               <FaEdit />
//                             </Link>
//                             <button onClick={() => handleDelete(c._id)} className="btn btn-ghost btn-xs text-red-500">
//                               <FaTrash />
//                             </button>
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyCreatedContests;

import { Link } from 'react-router';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import api from '../../../utils/api';
import { LuClipboardPen } from 'react-icons/lu';
import { useState, useEffect } from 'react';

const MyCreatedContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data } = await api.get('/api/contests/my-contests');
        setContests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContests();
  }, []);

  const deleteContest = async (id) => {
    Swal.fire({ title: 'Delete?', icon: 'warning', showCancelButton: true }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/contests/${id}`);
          setContests(contests.filter(c => c._id !== id));
          Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500 });
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Error!' });
        }
      }
    });
  };

  const statusBadges = { pending: 'badge-warning', confirmed: 'badge-success', rejected: 'badge-error' };

  if (loading) return <div className="text-center py-12"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Contests</h1>

      {contests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-6xl mb-2 flex justify-center"><LuClipboardPen /></p>
          <p className="text-gray-600 mb-4">No contests yet</p>
          <Link to="/dashboard/add-contest" className="btn bg-[#20beff] text-white">
            Create Contest
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Contest</th>
                <th>Type</th>
                <th>Status</th>
                <th>Participants</th>
                <th>Prize</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map(c => {
                const isPending = c.status === 'pending';
                const isExpired = new Date(c.deadline) < new Date();
                return (
                  <tr key={c._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <img src={c.image} alt="" className="w-10 h-10 rounded" />
                        <div>
                          <div className="font-bold text-sm">{c.name}</div>
                          <div className="text-xs opacity-60">{c.description.slice(0, 25)}...</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-sm badge-ghost">{c.contestType}</span></td>
                    <td><span className={`badge badge-sm ${statusBadges[c.status]}`}>{c.status}</span></td>
                    <td className="text-center">{c.participantCount}</td>
                    <td className="font-semibold text-[#20beff]">${c.prizeMoney}</td>
                    <td className="text-sm">
                      {new Date(c.deadline).toLocaleDateString()}
                      {isExpired && <span className="badge badge-error badge-xs ml-2">Expired</span>}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <Link to={`/dashboard/submissions/${c._id}`} className="btn btn-ghost btn-xs"><FaEye /></Link>
                        {isPending && (
                          <>
                            <Link to={`/dashboard/edit-contest/${c._id}`} className="btn btn-ghost btn-xs text-blue-500"><FaEdit /></Link>
                            <button onClick={() => deleteContest(c._id)} className="btn btn-ghost btn-xs text-red-500"><FaTrash /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyCreatedContests;