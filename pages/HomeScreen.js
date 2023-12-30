// .../pages/HomeScreen.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigation = useNavigation();
    const [masterData, setMasterData] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState("aed");
    const [currencyList, setCurrencyList] = useState({});

    const filteredData =
        masterData &&
        masterData.filter(
            (coin) =>
                coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );

    useEffect(() => {
        const retrieveCoinData = async () => {
            try {
                const { data } = await axios.get(
                    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${selectedCurrency}`
                );
                setMasterData(data);
            } catch (ex) {
                console.log(ex);
            }
        };

        const retrieveCurrencyList = async () => {
            try {
                const { data } = await axios.get(
                    "https://api.coingecko.com/api/v3/coins/bitcoin"
                );
                setCurrencyList(data.market_data.current_price);
            } catch (ex) {
                console.log("Currency list could not be retrieved: ", ex);
            }
        };

        retrieveCoinData();
        retrieveCurrencyList();
    }, [selectedCurrency]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.coinRow}
            onPress={() =>
                navigation.navigate("Details", {
                    coinId: item.id,
                    selectedCurrency: selectedCurrency,
                })
            }>
            <View style={styles.coinImgContainer}>
                <Image
                    style={styles.coinImg}
                    source={{
                        uri: item.image,
                    }}
                />
            </View>
            <Text style={styles.coinPrice}>
                {item.current_price.toFixed(2)}
            </Text>
            <Text style={styles.coinName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.intro}>Cryptocurrency List</Text>

            <View style={styles.inputGroup}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search by coin name"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                    inputMode="text"
                />
                {searchQuery && (
                    <TouchableOpacity
                        style={styles.clearBtn}
                        onPress={() => setSearchQuery("")}>
                        <Text style={styles.clearBtnText}>❌</Text>
                    </TouchableOpacity>
                )}

                <Picker
                    style={styles.currencyPicker}
                    selectedValue={selectedCurrency}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedCurrency(itemValue)
                    }
                    dropdownIconColor="white">
                    {masterData &&
                        Object.keys(
                            currencyList || { selectedCurrency: "1" }
                        ).map((currency) => (
                            <Picker.Item
                                color="black"
                                key={currency}
                                label={currency.toUpperCase()}
                                value={currency}
                            />
                        ))}
                </Picker>
            </View>
            <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={
                    (item) =>
                        item.id ? item.id.toString() : item.symbol.toString() // fallback id if item.id does not exist
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(20, 22, 25)",
    },
    intro: {
        color: "white",
        fontSize: 20,
        margin: 10,
    },
    inputGroup: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    searchBar: {
        margin: 10,
        borderWidth: 1,
        borderColor: "white",
        backgroundColor: "white",
        padding: 8,
        flex: 1,
        borderRadius: 25,
    },
    clearBtn: {
        backgroundColor: "rgb(17, 18, 20)",
        borderRadius: 25,
        padding: 8,
    },
    coinRow: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "white",
        padding: 15,
        marginBottom: 10,
    },
    coinImgContainer: {
        width: "20%",
    },
    coinImg: {
        height: 50,
        width: 50,
    },
    coinPrice: {
        color: "white",
        fontSize: 16,
        width: "30%",
        textAlign: "center",
    },
    coinName: {
        textAlign: "right",
        color: "white",
        fontSize: 16,
        width: "25%",
    },
    currencyPicker: {
        width: "40%",
        color: "white",
    },
});

export default HomeScreen;
