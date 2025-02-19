import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

import { getProjectsByUserId, getSensorsByProjectId } from '@/APIs/profileApi';
import { updateUser } from '@/APIs/updateUser';

import { FaEdit } from 'react-icons/fa';
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getToken } from '@/utils/auth';

const Profile = () => {
  const { user, fetchUserData } = useAuth();
  const { toast } = useToast()
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [projects, setProjects] = useState([]);
  const [sensors, setSensors] = useState({});
  const [editUser, setEditUser] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.email) {
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=random&color=ffffff&bold=true`;
      setProfileImageUrl(avatarUrl);
      setEditUser(user);
    }

    const fetchProjectsAndSensors = async () => {
      try {
        if (user && user.id) {
          const projectsData = await getProjectsByUserId(user.id);
          setProjects(projectsData);

          const sensorsData = {};
          for (const project of projectsData) {
            sensorsData[project.id] = await getSensorsByProjectId(project.id, user.id);
          }
          setSensors(sensorsData);
        }
      } catch (error) {
        console.error('Failed to fetch projects and sensors:', error);
      }
    };
    fetchProjectsAndSensors();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSubmit = async (e) => {
    try {
      const updatedUser = await updateUser(editUser);
      setEditUser(updatedUser.data);
      // setError(updatedUser.message);
      toast({
        variant: "success",
        title: updatedUser?.status,
        description: updatedUser?.message,
      });
      fetchUserData(getToken(), updatedUser.data.id);
    } catch (error) {
      console.error('Failed to update user:', error);
      toast({
        variant: "destructive",
        title: "Failed to update user",
        description: "Please try again later",
      });
    }
  };

  return (
    <div className=' w-full h-full flex flex-col sm:flex-row items-center justify-center pt-8 p-2 sm:p-3 md:p-4 lg:p-8 sm:space-x-4'>
      <Card className='shadow-lg mb-4 sm:mb-0 w-full'>
        <CardHeader className='bg-gradient-to-br from-foreground to-tertiary text-secondary rounded-t-lg pb-3'>
        <div>
        <Dialog>
        <DialogTrigger asChild>
        <FaEdit className='float-right text-secondary text-2xl cursor-pointer'/>
        </DialogTrigger>

        <DialogContent className="bg-secondary">
          <DialogHeader>
            <DialogTitle className="text-foreground font-semibold">Edit Profile</DialogTitle>
            <DialogDescription className="text-foreground font-semibold" >Update your profile details below.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 text-accent-foreground'>
            <Input className='bg-gray-100' label="Username" name="username" value={editUser.username} onChange={handleInputChange} />
            <Input className='bg-gray-100' label="First Name" name="firstName" value={editUser.firstName} onChange={handleInputChange} />
            <Input className='bg-gray-100' label="Last Name" name="lastName" value={editUser.lastName} onChange={handleInputChange} />
            <Input className='bg-gray-100' label="Register Number" name="registerNumber" value={editUser.registerNumber} onChange={handleInputChange} />
            <Input className='bg-gray-100' label="Batch" name="batch" value={editUser.batch} onChange={handleInputChange} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={handleSubmit} className="bg-foreground hover:bg-tertiary">Save</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
          <div className='flex flex-col items-center'>
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="rounded-full h-48 w-48 mb-4 border-4 border-white shadow-md bg" />
            ) : (
              <div className="rounded-full h-48 w-48 mb-4 bg-gray-500"></div>
            )}
            <CardTitle className='text-xl font-bold mb-0 text-secondary'>My Profile</CardTitle>
            <CardDescription className='text-secondary'>View and edit your profile</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className='py-6 px-2 sm:px-4 md:px-8 bg-secondary rounded-b-lg'>
          <div className='grid grid-cols-2 gap-y-4 '>
            <div className='font-semibold text-primary'>Email:</div><div className='text-primary font-medium break-words'>{user.email}</div>
            <div className='font-semibold text-primary'>Username:</div><div className='text-primary font-medium'>{user.username}</div>
            <div className='font-semibold text-primary'>First Name:</div><div className='text-primary font-medium'>{user.firstName}</div>
            <div className='font-semibold text-primary'>Last Name:</div><div className='text-primary font-medium'>{user.lastName}</div>
            <div className='font-semibold text-primary'>Register Number:</div><div className='text-primary font-medium'>{user.registerNumber}</div>
            <div className='font-semibold text-primary'>Batch:</div><div className='text-primary font-medium'>{user.batch}</div>
            <div className='font-semibold text-primary'>Role:</div><div className='text-primary font-medium'>{user.role === "USER" ? "Student" : "Admin"}</div>
          </div>
        </CardContent>
      </Card>

      {/* Project List */}
      <Card className='shadow-lg mb-4 sm:mb-0 w-full'>
        <CardHeader className='bg-gradient-to-br from-foreground to-tertiary text-secondary rounded-t-lg pb-3'>
          <CardTitle className='text-xl font-bold mb-0 text-center'>Projects and Sensors</CardTitle>
          <CardDescription className='text-base text-secondary text-center'>Here is the list of project you created</CardDescription>
        </CardHeader>

        <CardContent className='py-6 px-2 sm:px-4 md:px-8 bg-accent'>
          {projects.map(project => (
            <div key={project.id} className='mb-4 bg-secondary p-4 rounded-lg shadow-md '>
              <div className='mb-2 grid grid-cols-2 '>
                <div className='text-lg font-bold mb-1 text-primary'>Project Name:</div>
                <div className='text-lg font-bold mb-1 text-primary'>{project.name}</div>
                <div className='text-primary font-medium'>Description:</div><div className='text-primary font-medium mb-2'>{project.description}</div>
                <div className='text-primary font-medium'>MicroController:</div><div className='text-primary font-medium mb-2'>{project.microcontroller}</div>
              </div>
              <div>
              
                <CardTitle className='text-lg font-bold mb-1 text-primary'>Sensors:</CardTitle>
                <ul className='list-disc list-inside text-primary font-medium'>
                  {sensors[project.id]?.map(sensor => (
                    <li key={sensor.id}>{sensor.name} ({sensor.type})</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div >
  );
};

export default Profile;