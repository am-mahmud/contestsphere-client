// import { useForm } from 'react-hook-form';
// import { useNavigate, useParams } from 'react-router';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { contestAPI } from '../../../api/contest';
// import Swal from 'sweetalert2';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { useState, useEffect } from 'react';

// const EditContest = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { register, handleSubmit, formState: { errors }, reset } = useForm();
//   const [deadline, setDeadline] = useState(new Date());

//   // Fetch contest details
//   const { data: contest, isLoading } = useQuery({
//     queryKey: ['contest', id],
//     queryFn: () => contestAPI.getContest(id),
//   });

//   // Pre-fill form when data loads
//   useEffect(() => {
//     if (contest) {
//       reset({
//         name: contest.name,
//         image: contest.image,
//         description: contest.description,
//         taskInstruction: contest.taskInstruction,
//         contestType: contest.contestType,
//         price: contest.price,
//         prizeMoney: contest.prizeMoney,
//       });
//       setDeadline(new Date(contest.deadline));
//     }
//   }, [contest, reset]);

//   // Update contest mutation
//   const updateMutation = useMutation({
//     mutationFn: (data) => contestAPI.updateContest(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['myCreatedContests']);
//       queryClient.invalidateQueries(['contest', id]);
//       Swal.fire({
//         icon: 'success',
//         title: 'Contest Updated!',
//         text: 'Your contest has been updated successfully',
//         showConfirmButton: false,
//         timer: 1500,
//       });
//       navigate('/dashboard/my-contests');
//     },
//     onError: (error) => {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: error.response?.data?.message || 'Failed to update contest',
//       });
//     },
//   });

//   const onSubmit = (data) => {
//     const contestData = {
//       ...data,
//       deadline: deadline.toISOString(),
//       price: parseFloat(data.price),
//       prizeMoney: parseFloat(data.prizeMoney),
//     };
//     updateMutation.mutate(contestData);
//   };

//   const contestTypes = [
//     'Programming',
//     'Article Writing',
//     'Retro Gaming',
//     'Business Ideas',
//     'Web Design',
//     'Mobile App Design',
//   ];

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
//           Edit Contest
//         </h1>
//         <p className="text-gray-600">Update your contest details</p>
//       </div>

//       {/* Form Card */}
//       <div className="card bg-white shadow-lg max-w-4xl">
//         <div className="card-body">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             {/* Contest Name */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Contest Name *</span>
//               </label>
//               <input
//                 type="text"
//                 className="input input-bordered"
//                 {...register('name', {
//                   required: 'Contest name is required',
//                   minLength: { value: 5, message: 'Name must be at least 5 characters' },
//                 })}
//               />
//               {errors.name && (
//                 <span className="text-error text-sm mt-1">{errors.name.message}</span>
//               )}
//             </div>

//             {/* Image URL */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Contest Image URL *</span>
//               </label>
//               <input
//                 type="url"
//                 className="input input-bordered"
//                 {...register('image', {
//                   required: 'Image URL is required',
//                   pattern: {
//                     value: /^https?:\/\/.+\..+/i,
//                     message: 'Invalid URL format',
//                   },
//                 })}
//               />
//               {errors.image && (
//                 <span className="text-error text-sm mt-1">{errors.image.message}</span>
//               )}
//             </div>

//             {/* Description */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Contest Description *</span>
//               </label>
//               <textarea
//                 className="textarea textarea-bordered h-32"
//                 {...register('description', {
//                   required: 'Description is required',
//                   minLength: { value: 50, message: 'Description must be at least 50 characters' },
//                 })}
//               ></textarea>
//               {errors.description && (
//                 <span className="text-error text-sm mt-1">{errors.description.message}</span>
//               )}
//             </div>

//             {/* Task Instructions */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Task Instructions *</span>
//               </label>
//               <textarea
//                 className="textarea textarea-bordered h-32"
//                 {...register('taskInstruction', {
//                   required: 'Task instructions are required',
//                   minLength: { value: 30, message: 'Instructions must be at least 30 characters' },
//                 })}
//               ></textarea>
//               {errors.taskInstruction && (
//                 <span className="text-error text-sm mt-1">{errors.taskInstruction.message}</span>
//               )}
//             </div>

//             {/* Contest Type */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Contest Type *</span>
//               </label>
//               <select
//                 className="select select-bordered"
//                 {...register('contestType', { required: 'Contest type is required' })}
//               >
//                 <option value="">Select contest type</option>
//                 {contestTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//               {errors.contestType && (
//                 <span className="text-error text-sm mt-1">{errors.contestType.message}</span>
//               )}
//             </div>

//             {/* Price and Prize Money */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Entry Fee ($) *</span>
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="input input-bordered"
//                   {...register('price', {
//                     required: 'Entry fee is required',
//                     min: { value: 1, message: 'Entry fee must be at least $1' },
//                   })}
//                 />
//                 {errors.price && (
//                   <span className="text-error text-sm mt-1">{errors.price.message}</span>
//                 )}
//               </div>

//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Prize Money ($) *</span>
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   className="input input-bordered"
//                   {...register('prizeMoney', {
//                     required: 'Prize money is required',
//                     min: { value: 1, message: 'Prize money must be at least $1' },
//                   })}
//                 />
//                 {errors.prizeMoney && (
//                   <span className="text-error text-sm mt-1">{errors.prizeMoney.message}</span>
//                 )}
//               </div>
//             </div>

//             {/* Deadline */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Contest Deadline *</span>
//               </label>
//               <DatePicker
//                 selected={deadline}
//                 onChange={(date) => setDeadline(date)}
//                 showTimeSelect
//                 dateFormat="MMMM d, yyyy h:mm aa"
//                 minDate={new Date()}
//                 className="input input-bordered w-full"
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex gap-4 mt-8">
//               <button
//                 type="submit"
//                 className="btn bg-[#20beff] text-white btn-lg flex-1 hover:bg-[#1a9dd9]"
//                 disabled={updateMutation.isPending}
//               >
//                 {updateMutation.isPending ? (
//                   <>
//                     <span className="loading loading-spinner"></span>
//                     Updating...
//                   </>
//                 ) : (
//                   'Update Contest'
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate('/dashboard/my-contests')}
//                 className="btn btn-outline btn-lg"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditContest;

import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contestAPI } from '../../../api/contest';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect } from 'react';

const EditContest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [deadline, setDeadline] = useState(new Date());

  const { data: contest, isLoading } = useQuery({
    queryKey: ['contest', id],
    queryFn: () => contestAPI.getContest(id),
  });

  useEffect(() => {
    if (contest) {
      reset(contest);
      setDeadline(new Date(contest.deadline));
    }
  }, [contest, reset]);

  const updateMutation = useMutation({
    mutationFn: (data) => contestAPI.updateContest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['myCreatedContests']);
      Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500 });
      navigate('/dashboard/my-contests');
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate({
      ...data,
      deadline: deadline.toISOString(),
      price: parseFloat(data.price),
      prizeMoney: parseFloat(data.prizeMoney),
    });
  };

  const contestTypes = ['Programming', 'Article Writing', 'Retro Gaming', 'Business Ideas', 'Web Design', 'Mobile App Design'];

  if (isLoading) return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Edit Contest</h1>
        <p className="text-gray-600">Update contest details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card bg-white shadow-lg">
        <div className="card-body space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Contest Name *</span></label>
            <input
              type="text"
              className="input input-bordered"
              {...register('name', { required: 'Required', minLength: { value: 5, message: 'Min 5 characters' } })}
            />
            {errors.name && <span className="text-error text-sm">{errors.name.message}</span>}
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Image URL *</span></label>
            <input
              type="url"
              className="input input-bordered"
              {...register('image', { required: 'Required', pattern: { value: /^https?:\/\/.+\..+/i, message: 'Invalid URL' } })}
            />
            {errors.image && <span className="text-error text-sm">{errors.image.message}</span>}
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Description *</span></label>
            <textarea
              className="textarea textarea-bordered h-24"
              {...register('description', { required: 'Required', minLength: { value: 50, message: 'Min 50 characters' } })}
            ></textarea>
            {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Task Instructions *</span></label>
            <textarea
              className="textarea textarea-bordered h-24"
              {...register('taskInstruction', { required: 'Required', minLength: { value: 30, message: 'Min 30 characters' } })}
            ></textarea>
            {errors.taskInstruction && <span className="text-error text-sm">{errors.taskInstruction.message}</span>}
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Contest Type *</span></label>
            <select className="select select-bordered" {...register('contestType', { required: 'Required' })}>
              <option value="">Select type</option>
              {contestTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            {errors.contestType && <span className="text-error text-sm">{errors.contestType.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Entry Fee ($) *</span></label>
              <input
                type="number"
                step="0.01"
                className="input input-bordered"
                {...register('price', { required: 'Required', min: { value: 1, message: 'Min $1' } })}
              />
              {errors.price && <span className="text-error text-sm">{errors.price.message}</span>}
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Prize ($) *</span></label>
              <input
                type="number"
                step="0.01"
                className="input input-bordered"
                {...register('prizeMoney', { required: 'Required', min: { value: 1, message: 'Min $1' } })}
              />
              {errors.prizeMoney && <span className="text-error text-sm">{errors.prizeMoney.message}</span>}
            </div>
          </div>

  
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Deadline *</span></label>
            <DatePicker
              selected={deadline}
              onChange={(date) => setDeadline(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              className="input input-bordered w-full"
            />
          </div>

  
          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn bg-[#20beff] text-white flex-1" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <><span className="loading loading-spinner loading-sm"></span> Updating...</> : 'Update Contest'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard/my-contests')} className="btn btn-outline">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditContest;


