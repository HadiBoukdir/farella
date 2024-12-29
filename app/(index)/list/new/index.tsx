import {BodyScrollView} from "@/components/ui/BodyScrollView";
import {ThemedText} from "@/components/ThemedText";
import {StyleSheet, View} from "react-native";
import {IconCircle} from "@/components/IconCircle";
import {backgroundColors, emojies} from "@/constants/Colors";
import {useMemo, useState} from "react";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import {Href, useRouter} from "expo-router";

const isValidUUID = (id: string | null) => {
    if (!id) return false;
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

export default function NewListScreen(){
    const [listId, setListId] = useState('')
    const randomEmoji = useMemo(() => emojies[Math.floor(Math.random() * emojies.length)], [])
    const randomColor = useMemo(() => backgroundColors[Math.floor(Math.random() * backgroundColors.length)], [])
    const isValidListId = useMemo(() => isValidUUID(listId), [listId]);
    const router = useRouter();

    const joinShoppingListCallback = (listId: string) => {}
    const handleJoinList = () => {}
    const handleDismissTo = (screen: Href) => {
        if (router.canDismiss()) {
            router.dismiss();
            setTimeout(() => {
                router.push(screen);
            }, 100);
        }
    };
    return (
        <BodyScrollView contentContainerStyle={{
            padding: 16,
            gap: 32
        }}>
            <View style={{alignItems: 'center', gap: 16, marginTop: 32}}>
                <IconCircle emoji={randomEmoji} backgroundColor={randomColor} size={60} style={{alignSelf: 'center', marginBottom: 8}} />
                <ThemedText type="title">Better together</ThemedText>
                <ThemedText type="defaultSemiBold" style={{
                    color: 'gray',
                    textAlign: 'center'
                }}>
                    Create shared shopping lists and collaborate in real-time with family and friends
                </ThemedText>
            </View>

            <View style={{gap: 16}}>
                <Button onPress={() => handleDismissTo('/list/new/create')}>
                    Create new list
                </Button>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
                    <View style={styles.line} />
                    <ThemedText style={{
                        color: 'gray'
                    }}>or join existing</ThemedText>
                    <View style={styles.line}/>
                </View>
            </View>
            <View style={{gap: 16}}>
                <TextInput
                    placeholder="Enter list code"
                    value={listId}
                    onChangeText={setListId}
                    onSubmitEditing={(e) => {
                        joinShoppingListCallback(e.nativeEvent.text)
                    }}
                    containerStyle={{marginBottom: 0}}
                />
                <Button onPress={handleJoinList} disabled={!isValidListId}>
                    Join list
                </Button>
                <Button variant="ghost" onPress={() => handleDismissTo('/list/new/scan')}>
                    Scan QR code
                </Button>
            </View>
        </BodyScrollView>
    )
}

const styles = StyleSheet.create({
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(150, 150, 150, 0.2)'
    }
})