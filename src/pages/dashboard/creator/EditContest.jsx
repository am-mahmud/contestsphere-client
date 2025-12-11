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
        <div className="card-body space-y-2">
          <label className="label"><span className="label-text font-semibold">Contest Name *</span></label>
          <div className="form-control">
            <input
              type="text"
              className="input input-bordered w-full"
              {...register('name', { required: 'Required', minLength: { value: 5, message: 'Min 5 characters' } })}
            />
            {errors.name && <span className="text-error text-sm">{errors.name.message}</span>}
          </div>


          <label className="label"><span className="label-text font-semibold">Image URL *</span></label>
          <div className="form-control">
            <input
              type="url"
              className="input input-bordered w-full"
              {...register('image', { required: 'Required', pattern: { value: /^https?:\/\/.+\..+/i, message: 'Invalid URL' } })}
            />
            {errors.image && <span className="text-error text-sm">{errors.image.message}</span>}
          </div>

          <label className="label"><span className="label-text font-semibold">Description *</span></label>
          <div className="form-control">

            <textarea
              className="textarea textarea-bordered h-24 w-full"
              {...register('description', { required: 'Required', minLength: { value: 50, message: 'Min 50 characters' } })}
            ></textarea>
            {errors.description && <span className="text-error text-sm">{errors.description.message}</span>}
          </div>

          <label className="label"><span className="label-text font-semibold">Task Instructions *</span></label>
          <div className="form-control">

            <textarea
              className="textarea textarea-bordered h-24 w-full"
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
              className="input input-bordered w-96"
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


