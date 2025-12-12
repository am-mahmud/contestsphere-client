import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contestAPI } from '../../../api/contest';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';

const AddContest = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [deadline, setDeadline] = useState(new Date());

  const createMutation = useMutation({
    mutationFn: contestAPI.createContest,
    onSuccess: () => {
      queryClient.invalidateQueries(['myContests']);
      Swal.fire({
        icon: 'success',
        title: 'Contest Created!',
        text: 'Your contest is pending admin approval',
        showConfirmButton: false,
        timer: 2000,
      });
      navigate('/dashboard/my-contests');
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to create contest',
      });
    },
  });

  const onSubmit = (data) => {
    const contestData = {
      ...data,
      deadline: deadline.toISOString(),
      price: parseFloat(data.price),
      prizeMoney: parseFloat(data.prizeMoney),
    };
    createMutation.mutate(contestData);
  };

  const contestTypes = [
    'Programming',
    'Article Writing',
    'Retro Gaming',
    'Business Ideas',
    'Web Design',
    'Mobile App Design',
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold  mb-2">
          Create New Contest
        </h1>
        <p className="text-gray-600">
          Fill in the details to create an exciting contest for participants
        </p>
      </div>

      <div className="card bg-white shadow-lg max-w-4xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="label">
              <span className="label-text font-semibold">Contest Name *</span>
            </label>
            <div className="form-control">
              <input
                type="text"
                placeholder="Retro Game Design Challenge 2025"
                className="input input-bordered w-full"
                {...register('name', {
                  required: 'Contest name is required',
                  minLength: { value: 5, message: 'Name must be at least 5 characters' },
                })}
              />
              {errors.name && (
                <span className="text-error text-sm mt-1">{errors.name.message}</span>
              )}
            </div>

            <label className="label">
              <span className="label-text font-semibold">Contest Image URL *</span>
            </label>
            <div className="form-control">
              <input
                type="url"
                placeholder="Contest Image"
                className="input input-bordered w-full object-contain"
                {...register('image', {
                  required: 'Image URL is required',
                  pattern: {
                    value: /^https?:\/\/.+\..+/i,
                    message: 'Invalid URL format',
                  },
                })}
              />
              {errors.image && (
                <span className="text-error text-sm mt-1">{errors.image.message}</span>
              )}
            </div>

            <label className="label">
              <span className="label-text font-semibold">Contest Description *</span>
            </label>
            <div className="form-control">
              <textarea
                placeholder="Describe the contest, what participants need to do, and what makes it exciting..."
                className="textarea textarea-bordered h-32 w-full"
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 50, message: 'Description must be at least 50 characters' },
                })}
              ></textarea>
              {errors.description && (
                <span className="text-error text-sm mt-1">{errors.description.message}</span>
              )}
            </div>

            <label className="label">
              <span className="label-text font-semibold">Task Instructions *</span>
            </label>
            <div className="form-control">

              <textarea
                placeholder="Detailed instructions on what to submit, format requirements, etc..."
                className="textarea textarea-bordered h-32 w-full"
                {...register('taskInstruction', {
                  required: 'Task instructions are required',
                  minLength: { value: 30, message: 'Instructions must be at least 30 characters' },
                })}
              ></textarea>
              {errors.taskInstruction && (
                <span className="text-error text-sm mt-1">{errors.taskInstruction.message}</span>
              )}
            </div>

            <label className="label">
              <span className="label-text font-semibold">Contest Type *</span>
            </label>
            <div className="form-control">

              <select
                className="select select-bordered"
                {...register('contestType', { required: 'Contest type is required' })}
              >
                <option value="">Select contest type</option>
                {contestTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.contestType && (
                <span className="text-error text-sm mt-1">{errors.contestType.message}</span>
              )}
            </div>


            <div className="flex flex-row items-center justify-between">

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Entry Fee ($) *</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="50"
                  className="input input-bordered"
                  {...register('price', {
                    required: 'Entry fee is required',
                    min: { value: 1, message: 'Entry fee must be at least $1' },
                  })}
                />
                {errors.price && (
                  <span className="text-error text-sm mt-1">{errors.price.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Prize Money ($) *</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="500"
                  className="input input-bordered"
                  {...register('prizeMoney', {
                    required: 'Prize money is required',
                    min: { value: 1, message: 'Prize money must be at least $1' },
                  })}
                />
                {errors.prizeMoney && (
                  <span className="text-error text-sm mt-1">{errors.prizeMoney.message}</span>
                )}
              </div>
            </div>

            <label className="label">
              <span className="label-text font-semibold">Contest Deadline *</span>
            </label>
            <div className="form-control">
              <DatePicker
                selected={deadline}
                onChange={(date) => setDeadline(date)}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                className="input input-bordered w-96"
                placeholderText="Select deadline date and time"
              />
              
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                className="btn bg-[#20beff] text-white btn-lg hover:bg-[#1a9dd9]"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating Contest...
                  </>
                ) : (
                  'Create Contest'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContest;


