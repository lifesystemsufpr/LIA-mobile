import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  defaultQuestionnairesRepository,
  QuestionnairesRepository,
} from '../services/QuestionnairesRepository';
import {
  Questionnaire,
  QuestionnaireCategory,
  QuestionnaireResult,
} from '../types/questionnaire.types';

export const useQuestionnaires = (
  repository: QuestionnairesRepository = defaultQuestionnairesRepository
) => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [submissions, setSubmissions] = useState<QuestionnaireResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuestionnaireCategory | 'all'>('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [qList, subList] = await Promise.all([
        repository.getAll(),
        repository.getSubmissions(),
      ]);
      setQuestionnaires(qList);
      setSubmissions(subList);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredQuestionnaires = useMemo(() => {
    return questionnaires.filter((q) => {
      const matchesCategory =
        selectedCategory === 'all' || q.category === selectedCategory;
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        normalizedQuery === '' ||
        q.title.toLowerCase().includes(normalizedQuery) ||
        q.code.toLowerCase().includes(normalizedQuery) ||
        q.description.toLowerCase().includes(normalizedQuery) ||
        q.categoryLabel.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [questionnaires, selectedCategory, searchQuery]);

  const saveSubmission = useCallback(
    async (result: QuestionnaireResult) => {
      await repository.saveSubmission(result);
      await loadData();
    },
    [repository, loadData]
  );

  return {
    questionnaires,
    filteredQuestionnaires,
    submissions,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    refresh: loadData,
    saveSubmission,
  };
};
