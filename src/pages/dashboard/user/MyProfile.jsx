import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import api from '../../../utils/api';

const MyProfile = () => {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      photo: user?.photo || '',
      bio: user?.bio || '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.put('/api/users/me', data);
      setUser(response.data.user);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setIsLoading(false);
    }
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

                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                <div className="form-control">

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

                <label className="label">
                  <span className="label-text font-semibold">Photo URL</span>
                </label>
                <div className="form-control">

                  <input
                    type="url"
                    placeholder=""
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

                <label className="label">
                  <span className="label-text font-semibold">Bio</span>
                </label>
                <div className="form-control">
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
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
                  <img src={user?.photo} alt={user?.name} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <div className="badge badge-primary mt-2 capitalize">{user?.role}</div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default MyProfile;


