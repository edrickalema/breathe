import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';

interface WheelPickerProps {
    items: string[];
    onValueChange: (value: string) => void;
    initialValue?: string;
    itemHeight?: number;
    width?: number;
    label?: string;
}

const WheelPicker: React.FC<WheelPickerProps> = ({
    items,
    onValueChange,
    initialValue,
    itemHeight = 50,
    width = 100,
    label,
}) => {
    const flatListRef = useRef<FlatList>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Calculate padding to center the first and last items
    const containerHeight = itemHeight * 3; // Show 3 items (1 selected, 1 above, 1 below)
    const paddingVertical = (containerHeight - itemHeight) / 2;

    useEffect(() => {
        if (initialValue) {
            const index = items.indexOf(initialValue);
            if (index !== -1) {
                setSelectedIndex(index);
                // Wait for layout to scroll
                setTimeout(() => {
                    flatListRef.current?.scrollToOffset({
                        offset: index * itemHeight,
                        animated: false,
                    });
                }, 100);
            }
        }
    }, [initialValue, items, itemHeight]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / itemHeight);

        if (index !== selectedIndex && index >= 0 && index < items.length) {
            setSelectedIndex(index);
            onValueChange(items[index]);
            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                Haptics.selectionAsync();
            }
        }
    };

    const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / itemHeight);

        // Snap to exact position if needed (FlatList snapToInterval handles most of this)
        if (index >= 0 && index < items.length) {
            flatListRef.current?.scrollToOffset({
                offset: index * itemHeight,
                animated: true,
            });
        }
    };

    return (
        <View style={[styles.container, { height: containerHeight, width }]}>
            {/* Selection Overlay */}
            <View
                style={[
                    styles.selectionOverlay,
                    {
                        height: itemHeight,
                        top: paddingVertical,
                        width: '100%'
                    }
                ]}
            />

            <FlatList
                ref={flatListRef}
                data={items}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                snapToInterval={itemHeight}
                decelerationRate="fast"
                onScroll={handleScroll}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    paddingVertical: paddingVertical,
                }}
                renderItem={({ item, index }) => {
                    const isSelected = index === selectedIndex;
                    return (
                        <View style={[styles.item, { height: itemHeight }]}>
                            <Text
                                style={[
                                    styles.itemText,
                                    isSelected ? styles.selectedItemText : styles.unselectedItemText,
                                ]}
                            >
                                {item}
                            </Text>
                        </View>
                    );
                }}
            />
            {label && (
                <Text style={[styles.label, { top: paddingVertical + 15 }]}>{label}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    selectionOverlay: {
        position: 'absolute',
        backgroundColor: Colors.surfaceHighlight,
        borderRadius: 8,
        zIndex: -1,
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    itemText: {
        fontSize: 24,
        fontWeight: '600',
    },
    selectedItemText: {
        color: Colors.text.primary,
        fontWeight: '800',
        fontSize: 28,
    },
    unselectedItemText: {
        color: Colors.text.tertiary,
        opacity: 0.5,
    },
    label: {
        position: 'absolute',
        right: 4,
        fontSize: 12,
        fontWeight: '700',
        color: Colors.text.primary,
        pointerEvents: 'none',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default WheelPicker;
