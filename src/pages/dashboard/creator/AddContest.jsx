// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { contestAPI } from '../../../api/contest';
// import Swal from 'sweetalert2';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { useState } from 'react';

// const AddContest = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { register, handleSubmit, formState: { errors }, setValue } = useForm();
//   const [deadline, setDeadline] = useState(new Date());

//   const createMutation = useMutation({
//     mutationFn: contestAPI.createContest,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['myContests']);
//       Swal.fire({
//         icon: 'success',
//         title: 'Contest Created!',
//         text: 'Your contest is pending admin approval',
//         showConfirmButton: false,
//         timer: 2000,
//       });
//       navigate('/dashboard/my-contests');
//     },
//     onError: (error) => {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: error.response?.data?.message || 'Failed to create contest',
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
//     createMutation.mutate(contestData);
//   };

//   const contestTypes = [
//     'Image Design',
//     'Article Writing',
//     'Gaming Review',
//     'Business Ideas',
//     'Web Design',
//     'Mobile App Design',
//   ];

//   return (
//     <div>
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
//           Create New Contest
//         </h1>
//         <p className="text-gray-600">
//           Fill in the details to create an exciting contest for participants
//         </p>
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
//                 placeholder="e.g., Logo Design Challenge 2025"
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

//             {/* Contest Image URL */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Contest Image URL *</span>
//               </label>
//               <input
//                 type="url"
//                 placeholder="https://images.unsplash.com/photo-..."
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
//               <label className="label">
//                 <span className="label-text-alt">Use Unsplash, Pexels, or image hosting service</span>
//               </label>
//             </div>

//             {/* Description */}
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text font-semibold">Contest Description *</span>
//               </label>
//               <textarea
//                 placeholder="Describe the contest, what participants need to do, and what makes it exciting..."
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
//                 placeholder="Detailed instructions on what to submit, format requirements, etc..."
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

//             {/* Price and Prize Money Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Entry Fee */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Entry Fee ($) *</span>
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   placeholder="50"
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

//               {/* Prize Money */}
//               <div className="form-control">
//                 <label className="label">
//                   <span className="label-text font-semibold">Prize Money ($) *</span>
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   placeholder="500"
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
//                 placeholderText="Select deadline date and time"
//               />
//               <label className="label">
//                 <span className="label-text-alt">Participants must submit before this date</span>
//               </label>
//             </div>

//             {/* Submit Button */}
//             <div className="form-control mt-8">
//               <button
//                 type="submit"
//                 className="btn bg-[#20beff] text-white btn-lg hover:bg-[#1a9dd9]"
//                 disabled={createMutation.isPending}
//               >
//                 {createMutation.isPending ? (
//                   <>
//                     <span className="loading loading-spinner"></span>
//                     Creating Contest...
//                   </>
//                 ) : (
//                   'Create Contest'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddContest;


import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { contestAPI } from '../../../api/contest';
import Swal from 'sweetalert2';
import { useState } from 'react';

const AddContest = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [deadline, setDeadline] = useState(new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await contestAPI.createContest({
        ...data,
        deadline,
        price: parseFloat(data.price),
        prizeMoney: parseFloat(data.prizeMoney),
      });
      Swal.fire({ icon: 'success', title: 'Created!', text: 'Pending admin approval' });
      navigate('/dashboard/my-contests');
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error!', text: err.response?.data?.message });
    } finally {
      setLoading(false);
    }
  };

  const types = ['Image Design', 'Article Writing', 'Gaming Review', 'Business Ideas'];

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Create Contest</h1>
      <p className="text-gray-600 mb-6">Fill in the details to create a contest</p>

      <form onSubmit={handleSubmit(onSubmit)} className="card bg-white shadow-lg">
        <div className="card-body space-y-4">
          {/* Name */}
          <div className="form-control">
            <label className="label"><span className="font-semibold">Name *</span></label>
            <input type="text" placeholder="Contest name" className="input input-bordered" {...register('name', { required: 'Required', minLength: { value: 5, message: 'Min 5 chars' } })} />
            {errors.name && <span className="text-error text-sm">{errors.name.message}</span>}
          </div>

          {/* Image */}
          <div className="form-control">
            <label className="label"><span className="font-semibold">Image URL *</span></label>
            <input type="url" placeholder="https://..." className="input input-bordered" {...register('image', { required: 'Required', pattern: { value: /^https?:\/\/.+\..+/i, message: 'Invalid URL' } })} />
            {errors.image && <span className="text-error text-sm">{errors.image.message}</span>}
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label"><span className="font-semibold">Description *</span></label>
            <textarea placeholder="Describe the contest..." className="textarea textarea-bordered h-20" {...register('description', { required: 'Required', minLength: { value: 50, message: 'Min 50 chars' } })}></textarea>
            {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
          </div>

          {/* Task Instructions */}
          <div className="form-control">
            <label className="label"><span className="font-semibold">Task Instructions *</span></label>
            <textarea placeholder="What should participants do?" className="textarea textarea-bordered h-20" {...register('taskInstruction', { required: 'Required', minLength: { value: 30, message: 'Min 30 chars' } })}></textarea>
            {errors.taskInstruction && <span className="text-error text-sm">{errors.taskInstruction.message}</span>}
          </div>

          {/* Type */}
          <div className="form-control">
            <label className="label"><span className="font-semibold">Type *</span></label>
            <select className="select select-bordered" {...register('contestType', { required: 'Required' })}>
              <option value="">Select type</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.contestType && <span className="text-error text-sm">{errors.contestType.message}</span>}
          </div>

          {/* Price & Prize */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="font-semibold">Entry Fee ($) *</span></label>
              <input type="number" step="0.01" placeholder="50" className="input input-bordered" {...register('price', { required: 'Required', min: { value: 1, message: 'Min $1' } })} />
              {errors.price && <span className="text-error text-sm">{errors.price.message}</span>}
            </div>
            <div className="form-control">
              <label className="label"><span className="font-semibold">Prize Money ($) *</span></label>
              <input type="number" step="0.01" placeholder="500" className="input input-bordered" {...register('prizeMoney', { required: 'Required', min: { value: 1, message: 'Min $1' } })} />
              {errors.prizeMoney && <span className="text-error text-sm">{errors.prizeMoney.message}</span>}
            </div>
          </div>

          {/* Deadline */}
          <div className="form-control">
            <label className="label"><span className="font-semibold">Deadline *</span></label>
            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="input input-bordered" />
          </div>

          {/* Submit */}
          <button type="submit" className="btn bg-[#20beff] text-white mt-4" disabled={loading}>
            {loading ? <><span className="loading loading-spinner loading-sm"></span> Creating...</> : 'Create Contest'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddContest;