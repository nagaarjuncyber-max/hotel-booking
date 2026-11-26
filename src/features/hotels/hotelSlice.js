import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const errData = (err) => err.response?.data || { message: err.message };

export const fetchHotels = createAsyncThunk('hotels/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/hotels', { params });
    return data;
  } catch (e) {
    return rejectWithValue(errData(e));
  }
});

export const fetchHotelById = createAsyncThunk('hotels/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/hotels/${id}`);
    return data;
  } catch (e) {
    return rejectWithValue(errData(e));
  }
});

export const addHotel = createAsyncThunk('hotels/add', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/hotels', formData);
    return data;
  } catch (e) {
    return rejectWithValue(errData(e));
  }
});

export const updateHotel = createAsyncThunk('hotels/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/hotels/${id}`, formData);
    return data;
  } catch (e) {
    return rejectWithValue(errData(e));
  }
});

export const deleteHotel = createAsyncThunk('hotels/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/hotels/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(errData(e));
  }
});

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: { items: [], total: 0, current: null, loading: false, error: null },
  reducers: {
    clearCurrent(state) {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchHotels.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.data;
        s.total = a.payload.total;
      })
      .addCase(fetchHotels.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || 'Failed to load hotels';
      })
      .addCase(fetchHotelById.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchHotelById.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchHotelById.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || 'Failed to load hotel';
      });
  },
});

export const { clearCurrent } = hotelSlice.actions;
export default hotelSlice.reducer;