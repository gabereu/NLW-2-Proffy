import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import styles from './styles';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TacherItem';

function Favorites() {

    const [favorites, setFavorites] = useState<Teacher[]>([]);

    useFocusEffect(() => {
        let mounted = true;

        AsyncStorage.getItem('favorites')
        .then(response => {
            if(mounted){
                const favorites = (JSON.parse(response || '[]') as Array<Teacher>);
                setFavorites(favorites);
            }
        });

        return () => {
            mounted = false;
        }
    });

    return (
        <View style={styles.container}>
            <PageHeader title='Meus proffys favoritos' />

            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {favorites.map((teacher: Teacher, key) => 
                    <TeacherItem
                        key={key}
                        teacher={teacher}
                        favorited={true}
                    />
                )}
            </ScrollView>

        </View>
    );
}

export default Favorites;