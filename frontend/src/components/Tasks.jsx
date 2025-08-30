import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedPlan, deletePlan } from '../redux/features/tasks/tasksSlice';
import { useNavigate } from 'react-router-dom';