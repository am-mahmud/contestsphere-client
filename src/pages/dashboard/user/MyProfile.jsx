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
        <h1 className="text-3xl lg:text-4xl font-bold  mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information and track your performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:auto-rows-max">
        <div className="lg:col-span-1">
          <div className="card shadow-lg h-full">
            <div className="card-body items-center text-center">
              <div className="avatar mb-6">
                <div className="w-32 rounded-full ring ring-[#20beff] ring-offset-2">
                  <img src={user?.photo} alt={user?.name} />
                </div>
              </div>
              <h3 className="text-2xl font-bold ">{user?.name}</h3>
              <p className="text-sm text-gray-600 wrap-break-words">{user?.email}</p>
              <div className="btn bg-[#20beff] text-white mt-3 p-3 text-base capitalize w-full rounded-full">
                {user?.role}
              </div>
              
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card shadow-lg h-full">
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
                    placeholder="Your Photo URL"
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

                <div className="form-control grow">
                  <label className="label">
                    <span className="label-text font-semibold">Bio</span>
                  </label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    className="textarea textarea-bordered w-full grow"
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
      </div>
    </div>
  );
};

export default MyProfile;

