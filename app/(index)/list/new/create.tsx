import {BodyScrollView} from "@/components/ui/BodyScrollView";
import {ThemedText} from "@/components/ThemedText";
import React, {useEffect} from "react";
import {Link, router, Stack, useRouter} from "expo-router";
import {StyleSheet, View, Text} from "react-native";
import {appleBlue, backgroundColors, emojies} from "@/constants/Colors";
import TextInput from "@/components/ui/text-input";
import Button from "@/components/ui/button";
import {useListCreation} from "@/context/ListCreationContext";
import {useAddShoppingListCallback} from "@/stores/ShoppingListsStore";

export default function CreateScreen(){
    const router = useRouter()
    const [listName, setListName] = React.useState("")
    const [listDescription, setListDescription] = React.useState("")

    const {selectedColor, setSelectedColor, setSelectedEmoji, selectedEmoji} = useListCreation()

    const useAddShoppingList = useAddShoppingListCallback();

    const handleCreateList = () => {
        if (!listName) {
            return;
        }

        const listId = useAddShoppingList(
            listName,
            listDescription,
            selectedEmoji,
            selectedColor
        );

        router.replace({
            pathname: "/list/[listId]",
            params: { listId },
        });
    };

    useEffect(() => {
        setSelectedEmoji(emojies[Math.floor(Math.random() * emojies.length)])
        setSelectedColor(backgroundColors[Math.floor(Math.random() * backgroundColors.length)])

        return () => {
            setSelectedColor("")
            setSelectedEmoji("")
        }
    }, []);


    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: "New list",
                    headerLargeTitle: false,
                }}
            />
            <BodyScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Grocery Essentials"
                        variant="ghost"
                        size="lg"
                        value={listName}
                        onChangeText={setListName}
                        onSubmitEditing={handleCreateList}
                        returnKeyType="done"
                        autoFocus={true}
                        inputStyle={styles.titleInput}
                        containerStyle={styles.titleInputContainer}
                    />
                    <Link href={{
                            pathname:"/emoji-picker",
                        }}
                        style={[styles.emojiButton, {borderColor: selectedColor}]}
                    >
                        <View style={styles.emojiContainer}>
                            <Text>{selectedEmoji}</Text>
                        </View>
                    </Link>
                    <Link href={{
                            pathname:"/color-picker",
                        }}
                        style={[styles.emojiButton, {borderColor: selectedColor}]}
                    >
                        <View style={styles.colorContainer}>
                            <View
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 100,
                                    backgroundColor: selectedColor,
                                }}
                            />
                        </View>
                    </Link>
                </View>
                <TextInput
                    placeholder="Description (optional)"
                    variant="ghost"
                    size="md"
                    value={listDescription}
                    onChangeText={setListDescription}
                    onSubmitEditing={handleCreateList}
                    inputStyle={styles.descriptionInput}
                    multiline={true}
                    numberOfLines={3}
                />
                <Button
                    onPress={handleCreateList}
                    disabled={!listName}
                    variant="ghost"
                >
                    Create list
                </Button>
            </BodyScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    scrollViewContent: {
        padding: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    titleInput: {
        fontWeight: "600",
        fontSize: 28,
        padding: 0,
    },
    titleInputContainer: {
        flexGrow: 1,
        flexShrink: 1,
        maxWidth: "auto",
        marginBottom: 0,
    },
    emojiButton: {
        padding: 1,
        borderWidth: 3,
        borderRadius: 100,
    },
    emojiContainer: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    descriptionInput: {
        padding: 0,
    },
    createButtonText: {
        color: appleBlue,
        fontWeight: "normal",
    },
    colorButton: {
        padding: 1,
        borderWidth: 3,
        borderRadius: 100,
    },
    colorContainer: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
    },
});