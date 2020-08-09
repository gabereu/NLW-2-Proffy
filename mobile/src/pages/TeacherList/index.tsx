import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import styles from './styles';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TacherItem';
import api from '../../services/api';

function TeacherList() {

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [filters, setFilters] = useState({
        subject: '',
        week_day: '',
        time: '',
    });

    const handleInputChange = (field: string) => (text: string) => {
        setFilters(actualFilter => ({
          ...actualFilter,
          [field]: text,
        }))
      }

    function handleToogleFilters() {
        setIsFilterVisible(isVisible => !isVisible);
    }

    function handleFiltersSubmit() {
        api.get('/classes', {
            params: filters
          })
          .then(async (response) => {
            const classes = response.data;
            await loadFavoritesArray();
            setIsFilterVisible(false)
            setTeachers(classes)
          })
          .catch(() => {
            alert('Erro ao procurar as aulas!')
          })
    }

    useFocusEffect(() => {
        loadFavoritesArray()
    });

    async function loadFavoritesArray() {
        const response = await AsyncStorage.getItem('favorites');
        if (response) {
            const favoritedTeachers = JSON.parse(response);
            const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => teacher.id);
            setFavorites(favoritedTeachersIds);
        }
    }

    return (
        <View style={styles.container}>
            <PageHeader
                title='Proffys disponíveis'
                headerRight={
                    <BorderlessButton onPress={handleToogleFilters}>
                        <Feather name='filter' size={20} color='#fff' />
                    </BorderlessButton>
                }
            >
                {isFilterVisible &&
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Qual a matéria?'
                            placeholderTextColor='#c1bccc'
                            value={filters.subject}
                            onChangeText={handleInputChange('subject')}
                        />
                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Qual o dia?'
                                    placeholderTextColor='#c1bccc'
                                    value={filters.week_day}
                                    onChangeText={handleInputChange('week_day')}
                                />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder='Qual horário?'
                                    placeholderTextColor='#c1bccc'
                                    value={filters.time}
                                    onChangeText={handleInputChange('time')}
                                />
                            </View>
                        </View>

                        <RectButton style={styles.submitButton} onPress={handleFiltersSubmit}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                }
            </PageHeader>

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {teachers.map((teacher: Teacher, key) => 
                    <TeacherItem
                        key={key}
                        teacher={teacher}
                        favorited={favorites.includes(teacher.id)}
                    />
                )}
                
            </ScrollView>
        </View>
    );
}

export default TeacherList;