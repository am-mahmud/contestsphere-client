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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [deadline, setDeadline] = useState(new Date());

  /* ================= FETCH CONTEST ================= */
  const { data: contest, isLoading } = useQuery({
    queryKey: ['contest', id],
    queryFn: () => contestAPI.getContest(id),
  });

  useEffect(() => {
    if (contest) {
      reset({
        name: contest.name,
        image: contest.image,
        description: contest.description,
        taskInstruction: contest.taskInstruction,
        contestType: contest.contestType,
        price: contest.price,
        prizeMoney: contest.prizeMoney,
      });

      setDeadline(new Date(contest.deadline));
    }
  }, [contest, reset]);

  /* ================= UPDATE MUTATION (FIX) ================= */
  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      return await contestAPI.updateContest(id, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myCreatedContests']);
      queryClient.invalidateQueries(['contest', id]);

      Swal.fire({
        icon: 'success',
        title: 'Contest Updated!',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/dashboard/my-contests');
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'Something went wrong',
      });
    },
  });

  /* ================= SUBMIT ================= */
  const onSubmit = (data) => {
    updateMutation.mutate({
      ...data,
      deadline: deadline.toISOString(),
      price: Number(data.price),
      prizeMoney: Number(data.prizeMoney),
    });
  };

  const contestTypes = [
    'Programming',
    'Article Writing',
    'Retro Gaming',
    'Business Ideas',
    'Web Design',
    'Mobile App Design',
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Edit Contest</h1>
        <p className="text-gray-600">Update contest details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card bg-white shadow-lg">
        <div className="card-body space-y-3">

          {/* Contest Name */}
          <label className="label font-semibold">Contest Name *</label>
          <input
            className="input input-bordered"
            {...register('name', { required: 'Required', minLength: 5 })}
          />
          {errors.name && <p className="text-error">{errors.name.message}</p>}

          {/* Image */}
          <label className="label font-semibold">Image URL *</label>
          <input
            className="input input-bordered"
            {...register('image', { required: 'Required' })}
          />

          {/* Description */}
          <label className="label font-semibold">Description *</label>
          <textarea
            className="textarea textarea-bordered"
            {...register('description', { required: 'Required', minLength: 50 })}
          />

          {/* Task */}
          <label className="label font-semibold">Task Instructions *</label>
          <textarea
            className="textarea textarea-bordered"
            {...register('taskInstruction', { required: 'Required', minLength: 30 })}
          />

          {/* Contest Type */}
          <label className="label font-semibold">Contest Type *</label>
          <select className="select select-bordered" {...register('contestType', { required: true })}>
            <option value="">Select type</option>
            {contestTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Price + Prize */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              className="input input-bordered"
              {...register('price', { required: true, min: 1 })}
              placeholder="Entry Fee"
            />
            <input
              type="number"
              className="input input-bordered"
              {...register('prizeMoney', { required: true, min: 1 })}
              placeholder="Prize Money"
            />
          </div>

          {/* Deadline */}
          <label className="label font-semibold">Deadline *</label>
          <DatePicker
            selected={deadline}
            onChange={(date) => setDeadline(date)}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="input input-bordered"
          />

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="btn bg-[#20beff] text-white flex-1"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Contest'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/my-contests')}
              className="btn btn-outline"
            >
              Cancel
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default EditContest;
