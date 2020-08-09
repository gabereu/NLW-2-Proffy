import React, { useState } from 'react'
import { View, Image, Text, Linking } from 'react-native'
import { RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

import styles from './styles';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png'
import unFavoriteIcon from '../../assets/images/icons/unfavorite.png'
import whatsappIcon from '../../assets/images/icons/whatsapp.png'

import api from '../../services/api';

export interface Teacher{
    id: number,
    avatar: string,
    name: string,
    subject: string,
    bio: string,
    cost: number,
    whatsapp: string,

}

interface TeacherItemProps {
    teacher: Teacher,
    favorited: boolean,
}
const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, favorited }) => {

    const [isFavorited, setIsFavorited] = useState(favorited);

    function handleLinkToWhatsapp() {
        api.post('/connections',{
            user_id: teacher.id,
        })

        Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`)
    }

    async function handleToogleFavorite() {
        const response = await AsyncStorage.getItem('favorites');
        const favorites = (JSON.parse(response || '[]') as Array<Teacher>);
        if(isFavorited){
            const favoriteIndex = favorites.findIndex(teacherItem => teacherItem.id === teacher.id)

            favorites.splice(favoriteIndex, 1);

            setIsFavorited(false);
        }else {
            favorites.push(teacher);

            
            setIsFavorited(true);
        }
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    }

    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image
                    style={styles.avatar}
                    source={{ uri: teacher.avatar }}
                />

                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{teacher.name}</Text>
                    <Text style={styles.subject}>{teacher.subject}</Text>
                </View>
            </View>

            <Text style={styles.bio}>
                {teacher.bio}
            </Text>

            <View style={styles.footer}>
                <Text style={styles.price}>
                    Preço/hora {'   '}
                    <Text style={styles.priceValue}>R$ {teacher.cost}</Text>
                </Text>

                <View style={styles.buttonsContainer}>
                    <RectButton
                    style={[
                        styles.favoriteButton,
                        isFavorited ? styles.isFavorite: {}
                    ]}
                    onPress={handleToogleFavorite}
                    >
                        <Image source={isFavorited ? unFavoriteIcon : heartOutlineIcon} />
                    </RectButton>

                    <RectButton style={styles.contactButton} onPress={handleLinkToWhatsapp}>
                        <Image source={whatsappIcon} />
                        <Text style={styles.contactButtonText}>Entrar em contato.</Text>
                    </RectButton>
                </View>
            </View>
        </View>
    )
}

export default TeacherItem;