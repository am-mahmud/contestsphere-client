import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { userAPI } from '../../../api/user';
import Swal from 'sweetalert2';

const MyProfile = () => {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      photo: user?.photo || '',
      bio: user?.bio || '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries(['user-profile']);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update profile',
      });
    },
  });

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information and track your performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Update Profile</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Full Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="input input-bordered rounded-full w-full"
                    {...register('name', {
                      required: 'Name is required',
                    })}
                  />
                  {errors.name && (
                    <span className="text-error text-sm mt-1">{errors.name.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Photo URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="Your Photo"
                    className="input input-bordered rounded-full w-full"
                    {...register('photo', {
                      required: 'Photo URL is required',
                      pattern: {
                        value: /^https?:\/\/.+\..+/i,
                        message: 'Invalid URL',
                      },
                    })}
                  />
                  {errors.photo && (
                    <span className="text-error text-sm mt-1">{errors.photo.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Bio</span>
                  </label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    className="textarea textarea-bordered h-24 w-full"
                    {...register('bio')}
                  ></textarea>
                </div>

                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className="btn bg-[#20beff] text-white rounded-full hover:bg-[#1a9dd9] w-full"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-white shadow-lg">
            <div className="card-body items-center text-center">
              <div className="avatar mb-4">
                <div className="w-24 rounded-full ring ring-[#20beff] ring-offset-2">
                  <img src={user?.photo} alt={""} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <div className="badge bg-[#20beff] mt-2 p-2 text-lg capitalize">{user?.role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;


