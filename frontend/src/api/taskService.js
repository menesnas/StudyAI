import axios from 'axios';
import { API_BASE_URL, getRequestConfig } from './config';

/**
 * Plana ait görevleri getirir
 * @param {string} planId - Plan ID'si
 * @returns {Promise} API yanıtı
 */
export const fetchPlanTasks = async (planId) => {
  const response = await axios.get(
    `${API_BASE_URL}/tasks/plan/${planId}`, 
    getRequestConfig()
  );
  return response.data;
};

/**
 * Yeni bir görev oluşturur
 * @param {Object} taskData - Görev verileri
 * @returns {Promise} API yanıtı
 */
export const createNewTask = async (taskData) => {
  const response = await axios.post(
    `${API_BASE_URL}/tasks`, 
    taskData, 
    getRequestConfig()
  );
  return response.data;
};

/**
 * Görev bilgilerini günceller
 * @param {string} taskId - Görev ID'si
 * @param {Object} taskData - Güncellenecek görev verileri
 * @returns {Promise} API yanıtı
 */
export const updateTaskDetails = async (taskId, taskData) => {
  const response = await axios.put(
    `${API_BASE_URL}/tasks/${taskId}`, 
    taskData, 
    getRequestConfig()
  );
  return response.data;
};

/**
 * Görevi siler
 * @param {string} taskId - Silinecek görevin ID'si
 * @returns {Promise} API yanıtı
 */
export const removeTask = async (taskId) => {
  await axios.delete(
    `${API_BASE_URL}/tasks/${taskId}`, 
    getRequestConfig()
  );
  return taskId;
};

/**
 * Görevi tamamlandı olarak işaretler
 * @param {string} taskId - Görev ID'si
 * @returns {Promise} API yanıtı
 */
export const markTaskAsCompleted = async (taskId) => {
  const response = await axios.put(
    `${API_BASE_URL}/tasks/${taskId}`, 
    { status: 'completed' }, 
    getRequestConfig()
  );
  return response.data;
};

/**
 * Görev için kaynak önerilerini getirir
 * @param {string} taskId - Görev ID'si
 * @returns {Promise} API yanıtı
 */
export const getTaskResources = async (taskId) => {
  const response = await axios.get(
    `${API_BASE_URL}/tasks/${taskId}/resources`,
    getRequestConfig()
  );
  return response.data;
};