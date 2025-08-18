import axios from 'axios';
import { API_BASE_URL, getRequestConfig } from './config';

/**
 * Kullanıcının tüm planlarını getirir
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Promise} API yanıtı
 */
export const fetchUserPlans = async (userId) => {
  const response = await axios.get(
    `${API_BASE_URL}/plans/user/${userId}`, 
    getRequestConfig()
  );
  return response.data;
};

/**
 * Yeni bir plan oluşturur
 * @param {Object} planData - Plan verileri
 * @returns {Promise} API yanıtı
 */
export const createNewPlan = async (planData) => {
  const response = await axios.post(
    `${API_BASE_URL}/plans`, 
    planData, 
    getRequestConfig()
  );
  return response.data;
};

/**
 * Plan detaylarını getirir
 * @param {string} planId - Plan ID'si
 * @returns {Promise} API yanıtı
 */
export const fetchPlanDetails = async (planId) => {
  const response = await axios.get(
    `${API_BASE_URL}/plans/${planId}`, 
    getRequestConfig()
  );
  return response.data;
};

/**
 * Plan bilgilerini günceller
 * @param {string} planId - Plan ID'si
 * @param {Object} planData - Güncellenecek plan verileri
 * @returns {Promise} API yanıtı
 */
export const updatePlanDetails = async (planId, planData) => {
  const response = await axios.put(
    `${API_BASE_URL}/plans/${planId}`, 
    planData, 
    getRequestConfig()
  );
  return response.data;
};

/**
 * Planı siler
 * @param {string} planId - Silinecek planın ID'si
 * @returns {Promise} API yanıtı
 */
export const removePlan = async (planId) => {
  await axios.delete(
    `${API_BASE_URL}/plans/${planId}`, 
    getRequestConfig()
  );
  return planId;
};