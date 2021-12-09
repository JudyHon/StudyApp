import React from 'react';
import Toggle from 'react-native-toggle-element';

const ToggleSwitch = ({value, onValueChange, size}) => {
    const displaySize = size ? size : 25;
    return (
        <Toggle
            trackBar={{                        
                activeBackgroundColor: '#81b0ff',
                inActiveBackgroundColor: '#d0d0d0',
                height: displaySize,
                width: displaySize *2.4
            }}
            thumbColor="#ffffff"
            value={value}
            onPress={onValueChange}
            thumbButton={{
                width: displaySize * 1.2,
                height: displaySize * 1.2,
                radius: displaySize * 1.2 / 2,
                activeBackgroundColor: "#f0f0f0",
                inActiveBackgroundColor: "#e0e0e0"
            }}
        />
    )
}

export default ToggleSwitch;