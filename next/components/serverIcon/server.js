import React from 'react'
import styles from '@/styles/gw/_server.module.sass'
import * as ReactIcons from 'react-icons/md'

export default function Server({ service }) {
  console.log(service);
 // 解码 icon 字符串中的 HTML 实体
 const decodedIcon = service.icon.replace(/\\u003C/g, '<').replace(/\\u003E/g, '>');

 // 从图标字符串中提取图标名称
 const iconNameMatch = decodedIcon.match(/<(Md\w+)\s*\/>/);
 const iconName = iconNameMatch ? iconNameMatch[1] : null;

 // 从 react-icons/md 中获取对应的图标组件
 const IconComponent = iconName ? ReactIcons[iconName] : null;
  return (
    <div className={styles.server}>
      <div className={styles.serverIcon}>
   
        {IconComponent && <IconComponent />}
      </div>
      <div className={styles.serverText}>{service.name}</div>
    </div>
  )
}
