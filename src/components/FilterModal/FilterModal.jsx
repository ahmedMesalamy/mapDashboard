import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, Grid, MenuItem, Select, InputLabel, FormControl, Snackbar, CircularProgress, TextField,
  OutlinedInput, Checkbox, ListItemText, Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { format, subYears } from 'date-fns';

// Dummy data
const companyList = [
  { id: 'cmp2', label: 'Company 1' },
  { id: 'cmp1', label: 'Company 2' },
  { id: 'cmp3', label: 'Company 3' },
];

const hullJobs = [
  { id: '03573a58-6a32-4433-9e1a-9f9d31c71edb', label: 'Hull Inspection (HI)' },
  { id: 'b10dd87b-68b4-496d-9b60-39cf9f03c0bb', label: 'Propeller Polish (PP)' },
  { id: 'ee828f1f-f1cd-4962-a980-12ccc4e48e7b', label: 'Hull Cleaning (HC)' },
  { id: '3a95d310-64bc-4599-8c4d-9304d12bb986', label: 'Propeller Inspection (PI)' },
  { id: 'c854b265-067c-4b7a-8d6a-d00f7304297b', label: 'Drydock (DD)' },
];

// Dummy vessels per company
const vesselMap = {
  cmp1: ['Vessel A', 'Vessel B'],
  cmp2: ['Vessel C', 'Vessel D'],
  cmp3: ['Vessel E', 'Vessel F'],
};

const FilterModal = ({ defaultValues, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [vessels, setVessels] = useState([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    defaultValues: defaultValues || {
      dateFrom: format(subYears(new Date(), 5), 'yyyy-MM-dd'),
      dateTo: format(new Date(), 'yyyy-MM-dd'),
      company: ['cmp2'], // Company 1
      vessel: '',
      hullJobs: [],
    },
  });

  const watchedCompanies = watch('company');

  useEffect(() => {
    if (watchedCompanies && watchedCompanies.length === 1) {
      setVessels(vesselMap[watchedCompanies[0]]);
    } else {
      setVessels([]);
    }
  }, [watchedCompanies]);

  const onFormSubmit = (data) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSnackbarOpen(true);
      onSubmit(data); // Pass to App
    }, 5000);
  };

  return (
    <>
      <Dialog open fullWidth maxWidth="sm">
        <DialogTitle>Apply Global Filters</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onFormSubmit)} mt={2}>
            <Grid container spacing={2}>
              {/* Date From */}
              <Grid item xs={6}>
                <Controller
                  name="dateFrom"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Date From" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                  )}
                />
              </Grid>

              {/* Date To */}
              <Grid item xs={6}>
                <Controller
                  name="dateTo"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Date To" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                  )}
                />
              </Grid>

              {/* Company Multi-Select */}
              <Grid item xs={12}>
                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Company</InputLabel>
                      <Select
                        {...field}
                        multiple
                        input={<OutlinedInput label="Company" />}
                        renderValue={(selected) =>
                          companyList
                            .filter((c) => selected.includes(c.id))
                            .map((c) => c.label)
                            .join(', ')
                        }
                      >
                        {companyList.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            <Checkbox checked={field.value.includes(option.id)} />
                            <ListItemText primary={option.label} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Vessel Single-Select */}
              <Grid item xs={12}>
                <Controller
                  name="vessel"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Vessel</InputLabel>
                      <Select {...field} label="Vessel">
                        {vessels.map((v) => (
                          <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Hull Jobs Multi-Select */}
              <Grid item xs={12}>
                <Controller
                  name="hullJobs"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Hull Jobs</InputLabel>
                      <Select
                        {...field}
                        multiple
                        input={<OutlinedInput label="Hull Jobs" />}
                        renderValue={(selected) =>
                          hullJobs
                            .filter((job) => selected.includes(job.id))
                            .map((job) => job.label)
                            .join(', ')
                        }
                      >
                        {hullJobs.map((job) => (
                          <MenuItem key={job.id} value={job.id}>
                            <Checkbox checked={field.value.includes(job.id)} />
                            <ListItemText primary={job.label} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} textAlign="right">
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>Filters Applied Successfully</Alert>
      </Snackbar>
    </>
  );
};

export default FilterModal;
