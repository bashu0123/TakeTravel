'use client'
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, X, Plus, Trash, Image as ImageIcon, Edit, Ghost } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Guide {
  _id: string;
  name: string;
  email: string;
  experience: number;
  languages: string[];
  specialization: string;
  verified: boolean;
}

interface Package {
  id: string;
  name: string;
  description: string;
  origin: string;
  destination: string;
  price: number;
  duration: number;
  includes: string[];
  difficulty: 'easy' | 'moderate' | 'challenging' | 'difficult';
  imageBase64?: string;
}

const ControlPanel = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [newInclude, setNewInclude] = useState('');
  const [includes, setIncludes] = useState<string[]>([]);
  
  const [packageName, setPackageName] = useState('');
  const [description, setDescription] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'moderate' | 'challenging' | 'difficult'>('moderate');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<Package | null>(null);

  // Function to handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!packageToDelete) return;
    
    try {
      await axios.delete(`http://localhost:8000/packages/${packageToDelete.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('take-travel-token')}`
        }
      });
      
      setPackages(packages.filter(pkg => pkg.id !== packageToDelete.id));
      toast.success('Package deleted successfully');
    } catch (error) {
      toast.error('Failed to delete package');
      console.error('Error deleting package:', error);
    }
    
    setIsDeleteDialogOpen(false);
    setPackageToDelete(null);
  };

  // Function to start editing a package
  const handleEditClick = (pkg: Package) => {
    setEditingPackage(pkg);
    setPackageName(pkg.name);
    setDescription(pkg.description);
    setOrigin(pkg.origin);
    setDestination(pkg.destination);
    setPrice(pkg.price.toString());
    setDuration(pkg.duration.toString());
    setDifficulty(pkg.difficulty);
    setIncludes(pkg.includes);
    setImagePreviewUrl(pkg.imageBase64 || '');
  };

  // Function to handle package update
  const handleUpdatePackage = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!editingPackage) return;
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const packageData = {
      name: packageName,
      description,
      origin,
      destination,
      price: Number(price),
      duration: Number(duration),
      difficulty,
      includes: [...includes],
      imageBase64: imagePreviewUrl,
    };
    
    try {
      const result = await axios.patch(
        `http://localhost:8000/packages/${editingPackage.id}`,
        packageData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('take-travel-token')}`
          }
        }
      );
      
      if (result.data) {
        setPackages(packages.map(pkg => 
          pkg.id === editingPackage.id ? { ...pkg, ...packageData } : pkg
        ));
        toast.success('Package updated successfully');
        
        // Reset form and exit edit mode
        resetForm();
        setEditingPackage(null);
      }
    } catch (error) {
      toast.error('Failed to update package');
      console.error('Error updating package:', error);
    }
  };

  // Function to reset form
  const resetForm = () => {
    setPackageName('');
    setDescription('');
    setOrigin('');
    setDestination('');
    setPrice('');
    setDuration('');
    setDifficulty('moderate');
    setIncludes([]);
    setImageFile(null);
    setImagePreviewUrl('');
    setFormErrors({});
  };

  // Modify the existing form section to handle both create and update

  // Update the package card rendering to include edit and delete buttons

  // Add delete confirmation dialog
  const renderDeleteDialog = () => (
    <dialog
      open={isDeleteDialogOpen}
      className="fixed inset-0 flex items-center justify-center bg-black/50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold">Are you sure?</h2>
        <p className="text-gray-600 mt-2">
          This action cannot be undone. This will permanently delete the package
          and remove its data from our servers.
        </p>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => setIsDeleteDialogOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </dialog>
  );
  

  // Fetch guides function
  const fetchGuides = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('take-travel-token')}`
        }
      });
      // Filter only guide role users
      const guideUsers = response.data.data.users.filter((user: any) => user.role === 'guide');
      setGuides(guideUsers);
    } catch (error) {
      toast.error('Failed to fetch guides');
      console.error('Error fetching guides:', error);
    }
  };

  // Handle guide approval/rejection
  const handleGuideStatus = async (id: string, approve: boolean) => {
    try {
      if (approve) {
        await axios.patch(`http://localhost:8000/users/${id}/verify`, {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('take-travel-token')}`
          }
        });
        toast.success('Guide approved successfully');
      } else {
        await axios.delete(`http://localhost:8000/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('take-travel-token')}`
          }
        });
        toast.success('Guide rejected successfully');
      }
      fetchGuides(); // Refresh guides list
    } catch (error) {
      toast.error(approve ? 'Failed to approve guide' : 'Failed to reject guide');
      console.error('Error updating guide status:', error);
    }
  };

  // Package management functions
  const handleAddInclude = () => {
    if (newInclude.trim() !== '') {
      setIncludes([...includes, newInclude.trim()]);
      setNewInclude('');
    }
  };

  const handleRemoveInclude = (index: number) => {
    setIncludes(includes.filter((_, i) => i !== index));
  };

  const getPackages = async () => {
    try {
      const result = await axios.get('http://localhost:8000/packages/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('take-travel-token')}`
        }
      });
      if (Array.isArray(result.data?.data?.packages)) {
        const sanitizedPackages = result.data.data.packages.map((pkg: any) => ({
          id: pkg.id || pkg._id,
          name: pkg.name || 'Unnamed Package',
          description: pkg.description || 'No description available',
          origin: pkg.origin || 'Not specified',
          destination: pkg.destination || 'Not specified',
          price: typeof pkg.price === 'number' ? pkg.price : 0,
          duration: typeof pkg.duration === 'number' ? pkg.duration : 0,
          includes: Array.isArray(pkg.includes) ? pkg.includes : [],
          difficulty: pkg.difficulty || 'moderate',
          imageBase64: pkg.imageBase64 || null
        }));
        setPackages(sanitizedPackages);
      }
    } catch (error) {
      toast.error("Failed to fetch packages");
      console.error("Error fetching packages:", error);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    const reader = new FileReader();
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    reader.onloadend = () => {
      setImageFile(file);
      setImagePreviewUrl(reader.result as string);
    };
    
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!packageName.trim()) errors.name = "Package name is required";
    if (!description.trim()) errors.description = "Description is required";
    if (!origin.trim()) errors.origin = "Origin country is required";
    if (!destination.trim()) errors.destination = "Destination is required";
    if (!price.trim() || Number(price) <= 0) errors.price = "Valid price is required";
    if (!duration.trim() || Number(duration) <= 0) errors.duration = "Valid duration is required";
    
    return errors;
  };

  const handleSubmitPackage = async (e: FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    const handleEditClick = (pkg: Package) => {
      setEditingPackage(pkg);
      setPackageName(pkg.name);
      setDescription(pkg.description);
      setOrigin(pkg.origin);
      setDestination(pkg.destination);
      setPrice(pkg.price.toString());
      setDuration(pkg.duration.toString());
      setDifficulty(pkg.difficulty);
      setIncludes(pkg.includes);
      toast.success('Editing package');
    };

    const handleUpdatePackage = async () => {
      if (!editingPackage) return;
      try {
        await axios.patch(`http://localhost:8000/packages/${editingPackage.id}`, {
          name: packageName,
          description,
          origin,
          destination,
          price: Number(price),
          duration: Number(duration),
          difficulty,
          includes
        });
        setPackages(packages.map(pkg => (pkg.id === editingPackage.id ? { ...pkg, name: packageName, description, origin, destination, price: Number(price), duration: Number(duration), difficulty, includes } : pkg)));
        toast.success('Package updated successfully');
        resetForm();
        setEditingPackage(null);
      } catch (error) {
        toast.error('Failed to update package');
      }
    };
    const packageData = {
      name: packageName,
      description,
      origin,
      destination,
      price: Number(price),
      duration: Number(duration),
      difficulty,
      includes: [...includes],
      imageBase64: imagePreviewUrl,
    };
    
    try {
      const result = await axios.post(
        'http://localhost:8000/packages/',
        packageData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('take-travel-token')}`
          }
        }
      );
      
      if (result.data) {
        setPackages([...packages, result.data.package]);
        toast.success("Package created successfully");
        
        // Reset form
        setPackageName('');
        setDescription('');
        setOrigin('');
        setDestination('');
        setPrice('');
        setDuration('');
        setDifficulty('moderate');
        setIncludes([]);
        setImageFile(null);
        setImagePreviewUrl('');
        setFormErrors({});
      }
    } catch (error) {
      toast.error("Failed to create package");
      console.error("Error creating package:", error);
    }
  };

  useEffect(() => {
    fetchGuides();
    getPackages();
  }, []);

  return (
    <motion.div 
      className="container mx-auto py-6 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="guides">Guide Approvals</TabsTrigger>
          <TabsTrigger value="packages">Package Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guides">
          <Card>
            <CardHeader>
              <CardTitle>Pending Guide Approvals</CardTitle>
              <CardDescription>
                Review and approve guide registration requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {guides.filter(g => !g.verified).length === 0 ? (
                <p className="text-muted-foreground">No pending guide approvals</p>
              ) : (
                <div className="space-y-4">
                  {guides
                    .filter(guide => !guide.verified)
                    .map(guide => (
                      <motion.div
                        key={guide._id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{guide.name}</h3>
                            <p className="text-sm text-muted-foreground">{guide.email}</p>
                          </div>
                          <Badge>Pending</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium">Experience</p>
                            <p className="text-sm">{guide.experience} years</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Languages</p>
                            <p className="text-sm">{guide.languages.join(', ')}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium">Specialization</p>
                            <p className="text-sm">{guide.specialization}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGuideStatus(guide._id, false)}
                          >
                            <X className="mr-1 h-4 w-4" /> Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleGuideStatus(guide._id, true)}
                          >
                            <Check className="mr-1 h-4 w-4" /> Approve
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Approved Guides</CardTitle>
              </CardHeader>
              <CardContent>
                {guides.filter(g => g.verified).length === 0 ? (
                  <p className="text-muted-foreground">No approved guides yet</p>
                ) : (
                  <div className="space-y-2">
                    {guides
                      .filter(guide => guide.verified)
                      .map(guide => (
                        <div key={guide._id} className="flex items-center justify-between border-b py-2 last:border-0">
                          <div>
                            <p className="font-medium">{guide.name}</p>
                            <p className="text-sm text-muted-foreground">{guide.specialization}</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50">Approved</Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="packages">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Package</CardTitle>
                <CardDescription>
                  Create a new tour package for Nepal
                </CardDescription>
              </CardHeader>
              <CardContent>
              <form onSubmit={editingPackage ? handleUpdatePackage : handleSubmitPackage} className="space-y-4">

                  <div className="space-y-2">
                    <Label htmlFor="packageName">Package Name</Label>
                    <Input 
                      id="packageName"
                      placeholder="e.g. Everest Base Camp Trek"
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-500">{formErrors.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="packageImage">Package Image</Label>
                    <div className="flex flex-col space-y-2">
                      {imagePreviewUrl && (
                        <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
                          <img 
                            src={imagePreviewUrl} 
                            alt="Package preview" 
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreviewUrl('');
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {!imagePreviewUrl && (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 flex flex-col items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">Upload package image</p>
                          <p className="text-xs text-muted-foreground mb-4">PNG, JPG, or WEBP up to 5MB</p>
                          <Input
                            id="packageImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full max-w-xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Brief description of the package"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    {formErrors.description && (
                      <p className="text-sm text-red-500">{formErrors.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Origin Country</Label>
                      <Input 
                        id="origin"
                        placeholder="e.g. United States"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                      />
                      {formErrors.origin && (
                        <p className="text-sm text-red-500">{formErrors.origin}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination in Nepal</Label>
                      <Input 
                        id="destination"
                        placeholder="e.g. Kathmandu, Pokhara"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                      {formErrors.destination && (
                        <p className="text-sm text-red-500">{formErrors.destination}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (USD)</Label>
                      <Input 
                        id="price"
                        type="number"
                        min="0"
                        step="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                      {formErrors.price && (
                        <p className="text-sm text-red-500">{formErrors.price}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (Days)</Label>
                      <Input 
                        id="duration"
                        type="number"
                        min="1"
                        step="1"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                      {formErrors.duration && (
                        <p className="text-sm text-red-500">{formErrors.duration}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select 
                      value={difficulty}
                      onValueChange={(value: any) => setDifficulty(value)}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="challenging">Challenging</SelectItem>
                        <SelectItem value="difficult">Difficult</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>What's Included</Label>
                    <div className="flex space-x-2 mb-2 mt-1">
                      <Input
                        value={newInclude}
                        onChange={(e) => setNewInclude(e.target.value)}
                        placeholder="e.g. Airport transfers"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddInclude();
                          }
                        }}
                      />
                     
                    </div>
                    
                    <div className="space-y-2">
                      {includes.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm">{item}</span>
                          
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
    type="submit"
    className="w-full"
    onClick={editingPackage? (e)=> handleUpdatePackage(e):(e)=> handleSubmitPackage(e)}

  >
    {editingPackage ? (
      <>
        <Edit className="h-4 w-4 mr-2" />
        Update Package
      </>
    ) : (
      <>
        <Plus className="h-4 w-4 mr-2" />
        Add Package
      </>
    )}
  </Button>
  
  {editingPackage && (
    <Button 
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        resetForm();
        setEditingPackage(null);
      }}
    >
      <X className="h-4 w-4 mr-2" />
      Cancel Edit
    </Button>
  )}
  
                </form>
              </CardContent>
            </Card>
            
            <Card className="flex flex-col h-[1000px]">

              <CardHeader>
                <CardTitle>Existing Packages</CardTitle>
                <CardDescription>
                  View and manage current tour packages
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                {!packages || packages.length === 0 ? (
                  <p className="text-muted-foreground">No packages available</p>
                ) : (
                
  <div className="space-y-4 ">
                    {packages.map((pkg) => {
                      if (!pkg) return null;
                      
                      return (
                        <motion.div
                          key={pkg.id}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex flex-col md:flex-row gap-4 mb-3">
                            {pkg.imageBase64 ? (
                              <div className="w-full md:w-24 h-24 bg-muted rounded-md overflow-hidden">
                                <img 
                                  src={pkg.imageBase64} 
                                  alt={pkg.name || 'Package image'} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-full md:w-24 h-24 bg-muted rounded-md flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-medium">{pkg.name || 'Unnamed Package'}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {pkg.description || 'No description available'}
                                  </p>
                                </div>
                                <Badge color='red'>
                                  ${typeof pkg.price === 'number' ? pkg.price.toFixed(2) : '0.00'}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 text-sm">
                                <div>
                                  <span className="font-medium">Origin:</span> {pkg.origin || 'Not specified'}
                                </div>
                                <div>
                                  <span className="font-medium">Destination:</span> {pkg.destination || 'Not specified'}
                                </div>
                                <div>
                                  <span className="font-medium">Duration:</span> {pkg.duration || 0} days
                                </div>
                                <div>
                                  <span className="font-medium">Difficulty:</span> {pkg.difficulty || 'Not specified'}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Includes:</p>
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(pkg.includes) && pkg.includes.map((item, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
        <Button
        variant="link"          size="sm"
          onClick={() => handleEditClick(pkg)}
        >
          <Edit className="h-4 w-4 mr-1 " /> 
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            setPackageToDelete(pkg);
            setIsDeleteDialogOpen(true);
          }}
        >
          <Trash className="h-4 w-4 mr-1 " /> 
        </Button>
       
      </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                 
                )}
              </CardContent>
            </Card>
      

          </div>
        </TabsContent>
      </Tabs>
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Confirm Delete</CardTitle>
              <CardDescription>
                Are you sure you want to delete {packageToDelete?.name}? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setPackageToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
    
  );
};

export default ControlPanel;